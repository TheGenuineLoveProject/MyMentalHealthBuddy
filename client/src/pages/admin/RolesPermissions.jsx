import { Fragment } from "react";
import { Link } from "wouter";
import { Shield, Users, Settings, Check, X, Info, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import SEO from "../../components/SEO";

export default function RolesPermissions() {
  const roles = [
    {
      id: "admin",
      name: "Administrator",
      description: "Full access to all platform features",
      color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
    },
    {
      id: "moderator",
      name: "Moderator",
      description: "Content moderation and user support",
      color: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
    },
    {
      id: "editor",
      name: "Content Editor",
      description: "Create and edit platform content",
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
    },
    {
      id: "support",
      name: "Support Agent",
      description: "Handle user inquiries and basic moderation",
      color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
    }
  ];

  const permissions = [
    { id: "users_view", label: "View Users", category: "Users" },
    { id: "users_edit", label: "Edit Users", category: "Users" },
    { id: "users_delete", label: "Delete Users", category: "Users" },
    { id: "content_view", label: "View Content", category: "Content" },
    { id: "content_edit", label: "Edit Content", category: "Content" },
    { id: "content_publish", label: "Publish Content", category: "Content" },
    { id: "billing_view", label: "View Billing", category: "Billing" },
    { id: "billing_manage", label: "Manage Billing", category: "Billing" },
    { id: "settings_view", label: "View Settings", category: "Settings" },
    { id: "settings_edit", label: "Edit Settings", category: "Settings" },
    { id: "audit_view", label: "View Audit Logs", category: "Security" },
    { id: "roles_manage", label: "Manage Roles", category: "Security" }
  ];

  const rolePermissions = {
    admin: permissions.map(p => p.id),
    moderator: ["users_view", "content_view", "content_edit", "audit_view"],
    editor: ["content_view", "content_edit", "content_publish"],
    support: ["users_view", "content_view"]
  };

  const groupedPermissions = permissions.reduce((acc, perm) => {
    if (!acc[perm.category]) acc[perm.category] = [];
    acc[perm.category].push(perm);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Roles & Permissions — Admin"
        description="Manage admin roles and access permissions"
        noIndex
      />

      <main className="container mx-auto px-4 py-12 max-w-6xl">
        <Link href="/admin" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#8A9A5B', textDecoration: 'none', fontSize: '14px', marginBottom: '1rem' }} data-testid="link-back-command-center">
          <ArrowLeft size={16} /> Command Center
        </Link>
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground" data-testid="text-page-title">
                Roles & Permissions
              </h1>
              <p className="text-muted-foreground">Manage access control for admin users</p>
            </div>
          </div>
        </header>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <Users className="w-6 h-6 text-primary" />
            Defined Roles
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {roles.map(role => (
              <Card key={role.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{role.name}</CardTitle>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${role.color}`}>
                      {role.id}
                    </span>
                  </div>
                  <CardDescription>{role.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {rolePermissions[role.id]?.length || 0} permissions assigned
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <Settings className="w-6 h-6 text-primary" />
            Permission Matrix
          </h2>
          <Card>
            <CardContent className="pt-6 overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Permission</th>
                    {roles.map(role => (
                      <th key={role.id} className="text-center py-3 px-4 font-medium">
                        {role.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(groupedPermissions).map(([category, perms]) => (
                    <Fragment key={category}>
                      <tr className="bg-muted/50">
                        <td colSpan={roles.length + 1} className="py-2 px-4 font-semibold text-sm">
                          {category}
                        </td>
                      </tr>
                      {perms.map(perm => (
                        <tr key={perm.id} className="border-b">
                          <td className="py-3 px-4 text-sm">{perm.label}</td>
                          {roles.map(role => (
                            <td key={`${role.id}-${perm.id}`} className="text-center py-3 px-4">
                              {rolePermissions[role.id]?.includes(perm.id) ? (
                                <Check className="w-5 h-5 text-green-600 mx-auto" />
                              ) : (
                                <X className="w-5 h-5 text-muted-foreground/30 mx-auto" />
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </section>

        <section className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                Role-Based Access Control (RBAC)
              </h3>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                This matrix defines what each role can access. To modify roles or add new users, 
                contact a system administrator. All permission changes are logged in the audit trail.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
