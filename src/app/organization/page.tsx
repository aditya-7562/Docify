"use client";

import { useUser } from "@clerk/nextjs";
import { useCallback, useEffect, useState } from "react";
import { Building2Icon, UserPlusIcon, UsersIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { getOrganizationMembers, inviteToOrganization, removeFromOrganization, getOrganizationName } from "../documents/[documentId]/action";
import { Navbar } from "../(home)/navbar";
import Link from "next/link";
import Image from "next/image";

interface OrganizationMember {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
}

export default function OrganizationPage() {
  const { user } = useUser();
  const [members, setMembers] = useState<OrganizationMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [isInviting, setIsInviting] = useState(false);
  const [organizationName, setOrganizationName] = useState<string | null>(null);


  const organizationId = user?.organizationMemberships?.[0]?.organization?.id;
  const membership = user?.organizationMemberships?.[0];
  const organization = membership?.organization;

  const loadMembers = useCallback(async () => {
    if (!organizationId) return;
    
    setIsLoading(true);
    try {
      const orgMembers = await getOrganizationMembers(organizationId);
      setMembers(orgMembers);
    } catch (error) {
      toast.error("Failed to load organization members");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [organizationId]);

  const loadOrganizationName = useCallback(async () => {
    if (!organizationId) return;
    
    try {
      const name = await getOrganizationName(organizationId);
      setOrganizationName(name);
    } catch (error) {
      if (organization?.name) {
        setOrganizationName(organization.name);
      }
      console.error(error);
    }
  }, [organizationId, organization?.name]);

  useEffect(() => {
    if (organizationId) {
      loadMembers();
      loadOrganizationName();
    } else {
      setIsLoading(false);
    }
  }, [organizationId, loadMembers, loadOrganizationName]);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !organizationId) return;

    setIsInviting(true);
    try {
      await inviteToOrganization(organizationId, email);
      toast.success(`Invitation sent to ${email}`);
      setEmail("");

      await loadMembers();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to send invitation";
      toast.error(message);
    } finally {
      setIsInviting(false);
    }
  };

  const handleRemove = async (userId: string, userName: string) => {
    if (!organizationId) return;
    
    if (!confirm(`Are you sure you want to remove ${userName} from the organization?`)) {
      return;
    }

    try {
      await removeFromOrganization(organizationId, userId);
      toast.success(`${userName} removed from organization`);
      await loadMembers();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to remove member";
      toast.error(message);
    }
  };

  if (!organizationId) {
    return (
      <div className="flex-1 flex flex-col bg-white dark:bg-gray-900">
        <div className="fixed top-0 left-0 right-0 z-10">
          <Navbar />
        </div>
        <div className="mt-14 flex-1 flex items-center justify-center">
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle>No Organization</CardTitle>
              <CardDescription>
                You are not currently a member of any organization.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  const currentUserRole = membership?.role || "member";

  const canInvite = currentUserRole === "admin" || currentUserRole === "org:admin" || currentUserRole === "org_admin";
  const canRemove = currentUserRole === "admin" || currentUserRole === "org:admin" || currentUserRole === "org_admin";

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-gray-900">
      <div className="fixed top-0 left-0 right-0 z-10">
        <Navbar />
      </div>
      <div className="mt-14 flex-1">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex items-center gap-3 mb-6">
            <Link href="/" className="flex items-center gap-2">
              <Image src={"/logo.svg"} alt="Docify" width={24} height={24} />
              <span className="font-semibold text-lg dark:text-white">Docify</span>
            </Link>
            <span className="text-gray-400">/</span>
            <h1 className="text-2xl font-bold dark:text-white">Organization</h1>
          </div>

          {organizationName && (
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Building2Icon className="w-5 h-5" />
                  <CardTitle>{organizationName}</CardTitle>
                </div>
              </CardHeader>
            </Card>
          )}


          {canInvite && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlusIcon className="w-5 h-5" />
                  Invite Members
                </CardTitle>
                <CardDescription>
                  Invite team members to join your organization via email
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleInvite} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="flex gap-2">
                      <Input
                        id="email"
                        type="email"
                        placeholder="colleague@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isInviting}
                      />
                      <Button type="submit" disabled={isInviting || !email}>
                        {isInviting ? "Sending..." : "Send Invite"}
                      </Button>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UsersIcon className="w-5 h-5" />
                Organization Members
              </CardTitle>
              <CardDescription>
                {members.length} {members.length === 1 ? "member" : "members"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8 text-gray-500">Loading members...</div>
              ) : members.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No members found</div>
              ) : (
                <div className="space-y-3">
                  {members.map((member) => {
                    const isCurrentUser = member.id === user?.id;
                    const canRemoveThisUser = canRemove && !isCurrentUser;

                    return (
                      <div
                        key={member.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={member.avatar} alt={member.name} />
                            <AvatarFallback>
                              {member.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()
                                .slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium dark:text-white">
                                {member.name}
                                {isCurrentUser && (
                                  <span className="ml-2 text-xs text-gray-500">(You)</span>
                                )}
                              </p>
                            </div>
                            <p className="text-sm text-gray-500">{member.email}</p>
                            <p className="text-xs text-gray-400 capitalize mt-1">
                              {member.role}
                            </p>
                          </div>
                        </div>
                        {canRemoveThisUser && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemove(member.id, member.name)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                          >
                            <XIcon className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

