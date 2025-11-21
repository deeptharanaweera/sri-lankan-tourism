import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail } from "lucide-react";

export default async function ContactsManagementPage() {
  const supabase = await createClient();

  // Fetch contact messages
  const { data: contacts } = await supabase
    .from("contacts")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl md:text-5xl font-bold">Contact Messages</h1>
          <p className="text-lg text-muted-foreground mt-2">
            View and manage contact form submissions
          </p>
        </div>

        {/* Contacts List */}
        {contacts && contacts.length > 0 ? (
          <div className="space-y-4">
            {contacts.map((contact: any) => (
              <Card key={contact.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{contact.name}</h3>
                        {!contact.is_read && (
                          <Badge variant="default">New</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {contact.email} {contact.phone && `• ${contact.phone}`}
                      </p>
                      <p className="font-medium mb-1">{contact.subject}</p>
                      <p className="text-sm text-muted-foreground">{contact.message}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(contact.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Mail className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-semibold mb-2">No messages yet</p>
              <p className="text-sm text-muted-foreground">
                Contact form submissions will appear here
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

