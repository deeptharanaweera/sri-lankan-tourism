"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import { Calendar, Check, Edit, Mail, Phone, Trash2, X } from "lucide-react";

interface BookingManagerProps {
  initialBookings: BookingItem[];
}

interface BookingItem {
  id: string;
  booking_type: "tour" | "vehicle";
  status: string | null;
  payment_status: string | null;
  booking_date: string | null;
  return_date: string | null;
  number_of_people: number | null;
  total_amount: number | string | null;
  amount: number | string | null;
  contact_email: string | null;
  contact_phone: string | null;
  special_requests: string | null;
  created_at: string;
  tours?: { title: string | null } | null;
  vehicles?: { name: string | null } | null;
  users?: { email: string | null } | null;
  email?: string | null;
}

const statusOptions = ["pending", "confirmed", "cancelled", "completed"];
const paymentStatusOptions = ["pending", "paid", "refunded"];

export function BookingManager({ initialBookings }: BookingManagerProps) {
  const router = useRouter();
  const supabase = createClient();
  const [bookings, setBookings] = useState<BookingItem[]>(initialBookings);
  const [loading, setLoading] = useState<{ id: string; action: "status" | "payment" | "delete" | "edit" } | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{
    booking_date: string;
    return_date: string;
    number_of_people: number;
    contact_email: string;
    contact_phone: string;
    special_requests: string;
    total_amount: string;
  } | null>(null);

  const handleUpdateField = async (
    id: string,
    field: "status" | "payment_status",
    value: string,
  ) => {
    setLoading({ id, action: field === "status" ? "status" : "payment" });

    try {
      const { error } = await supabase
        .from("bookings")
        .update({ [field]: value })
        .eq("id", id);

      if (error) {
        throw error;
      }

      setBookings((previous) =>
        previous.map((booking) =>
          booking.id === id
            ? {
                ...booking,
                [field]: value,
              }
            : booking,
        ),
      );

      router.refresh();
    } catch (error: unknown) {
      const err = error as { message?: string };
      let message = err.message || "Unknown error";
      if (message.includes("row-level security")) {
        message =
          "Permission denied. Please ensure you are logged in as an admin with correct RLS policies.";
      }
      alert(`Error updating booking ${field.replace("_", " ")}: ` + message);
    } finally {
      setLoading(null);
    }
  };

  const handleStartEdit = (booking: BookingItem) => {
    setEditingId(booking.id);
    setEditForm({
      booking_date: booking.booking_date || "",
      return_date: booking.return_date || "",
      number_of_people: booking.number_of_people || 1,
      contact_email: booking.contact_email || "",
      contact_phone: booking.contact_phone || "",
      special_requests: booking.special_requests || "",
      total_amount: booking.total_amount?.toString() || "",
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm(null);
  };

  const handleSaveEdit = async (id: string) => {
    if (!editForm) return;

    setLoading({ id, action: "edit" });

    try {
      const updateData: {
        booking_date: string | null;
        return_date: string | null;
        number_of_people: number;
        contact_email: string | null;
        contact_phone: string | null;
        special_requests: string | null;
        total_amount?: number;
      } = {
        booking_date: editForm.booking_date || null,
        return_date: editForm.return_date || null,
        number_of_people: editForm.number_of_people || 1,
        contact_email: editForm.contact_email || null,
        contact_phone: editForm.contact_phone || null,
        special_requests: editForm.special_requests || null,
      };

      if (editForm.total_amount) {
        const amount = parseFloat(editForm.total_amount);
        if (!isNaN(amount)) {
          updateData.total_amount = amount;
        }
      }

      const { error } = await supabase
        .from("bookings")
        .update(updateData)
        .eq("id", id);

      if (error) {
        throw error;
      }

      setBookings((previous) =>
        previous.map((booking) =>
          booking.id === id
            ? {
                ...booking,
                ...updateData,
              }
            : booking,
        ),
      );

      setEditingId(null);
      setEditForm(null);
      router.refresh();
    } catch (error: unknown) {
      const err = error as { message?: string };
      let message = err.message || "Unknown error";
      if (message.includes("row-level security")) {
        message =
          "Permission denied. Please ensure you are logged in as an admin with correct RLS policies.";
      }
      alert("Error updating booking: " + message);
    } finally {
      setLoading(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this booking?")) {
      return;
    }

    setLoading({ id, action: "delete" });

    const { error } = await supabase.from("bookings").delete().eq("id", id);

    if (error) {
      let message = error.message;
      if (message.includes("row-level security")) {
        message =
          "Permission denied. Please ensure you are logged in as an admin with correct RLS policies.";
      }
      alert("Error deleting booking: " + message);
      setLoading(null);
      return;
    }

    setBookings((previous) => previous.filter((booking) => booking.id !== id));
    setLoading(null);
    router.refresh();
  };

  if (bookings.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-lg font-semibold mb-2">No bookings yet</p>
          <p className="text-sm text-muted-foreground">
            Bookings will appear here when customers make reservations
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => {
        const total =
          booking.total_amount ?? booking.amount ?? 0;
        const formattedTotal =
          typeof total === "number"
            ? total.toFixed(2)
            : Number(total).toFixed(2);

        const isEditing = editingId === booking.id;

        return (
          <Card key={booking.id}>
            <CardContent className="p-6 space-y-4">
              {!isEditing ? (
                <>
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold">
                          {booking.booking_type === "tour"
                            ? booking.tours?.title || "Tour Booking"
                            : booking.vehicles?.name || "Vehicle Rental"}
                        </h3>
                        <Badge variant="secondary" className="capitalize">
                          {booking.booking_type}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {booking.booking_date || "N/A"}
                        </span>
                        {booking.return_date && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Return {booking.return_date}
                          </span>
                        )}
                        {booking.number_of_people && booking.number_of_people > 0 ? (
                          <span>{booking.number_of_people} guests</span>
                        ) : null}
                      </div>
                      <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          {booking.users?.email || booking.contact_email || booking.email || "N/A"}
                        </span>
                        {booking.contact_phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="h-4 w-4" />
                            {booking.contact_phone}
                          </span>
                        )}
                      </div>
                      {booking.special_requests && (
                        <p className="text-sm text-muted-foreground">
                          Special requests: {booking.special_requests}
                        </p>
                      )}
                    </div>

                    <div className="text-right space-y-2">
                      <div className="text-2xl font-bold">${formattedTotal}</div>
                      <div className="text-xs text-muted-foreground">
                        Created {new Date(booking.created_at).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-[repeat(auto-fit,minmax(180px,1fr))]">
                    <label className="flex flex-col gap-1 text-sm">
                      <span className="font-medium">Status</span>
                      <select
                        className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                        value={booking.status || "pending"}
                        onChange={(event) =>
                          handleUpdateField(booking.id, "status", event.target.value)
                        }
                        disabled={loading?.id === booking.id && loading.action === "status"}
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status} className="capitalize">
                            {status}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="flex flex-col gap-1 text-sm">
                      <span className="font-medium">Payment Status</span>
                      <select
                        className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                        value={booking.payment_status || "pending"}
                        onChange={(event) =>
                          handleUpdateField(booking.id, "payment_status", event.target.value)
                        }
                        disabled={loading?.id === booking.id && loading.action === "payment"}
                      >
                        {paymentStatusOptions.map((status) => (
                          <option key={status} value={status} className="capitalize">
                            {status}
                          </option>
                        ))}
                      </select>
                    </label>

                    <div className="flex items-end justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStartEdit(booking)}
                        disabled={loading?.id === booking.id}
                        className="gap-1"
                      >
                        <Edit className="h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(booking.id)}
                        disabled={loading?.id === booking.id && loading.action === "delete"}
                        className="gap-1"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="booking_date">Booking Date</Label>
                      <Input
                        id="booking_date"
                        type="date"
                        value={editForm?.booking_date || ""}
                        onChange={(e) =>
                          setEditForm((prev) => (prev ? { ...prev, booking_date: e.target.value } : null))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="return_date">Return Date</Label>
                      <Input
                        id="return_date"
                        type="date"
                        value={editForm?.return_date || ""}
                        onChange={(e) =>
                          setEditForm((prev) => (prev ? { ...prev, return_date: e.target.value } : null))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="number_of_people">Number of People</Label>
                      <Input
                        id="number_of_people"
                        type="number"
                        min="1"
                        value={editForm?.number_of_people || 1}
                        onChange={(e) =>
                          setEditForm((prev) =>
                            prev ? { ...prev, number_of_people: parseInt(e.target.value) || 1 } : null
                          )
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="total_amount">Total Amount ($)</Label>
                      <Input
                        id="total_amount"
                        type="number"
                        step="0.01"
                        min="0"
                        value={editForm?.total_amount || ""}
                        onChange={(e) =>
                          setEditForm((prev) => (prev ? { ...prev, total_amount: e.target.value } : null))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact_email">Contact Email</Label>
                      <Input
                        id="contact_email"
                        type="email"
                        value={editForm?.contact_email || ""}
                        onChange={(e) =>
                          setEditForm((prev) => (prev ? { ...prev, contact_email: e.target.value } : null))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact_phone">Contact Phone</Label>
                      <Input
                        id="contact_phone"
                        type="tel"
                        value={editForm?.contact_phone || ""}
                        onChange={(e) =>
                          setEditForm((prev) => (prev ? { ...prev, contact_phone: e.target.value } : null))
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="special_requests">Special Requests</Label>
                    <Textarea
                      id="special_requests"
                      value={editForm?.special_requests || ""}
                      onChange={(e) =>
                        setEditForm((prev) => (prev ? { ...prev, special_requests: e.target.value } : null))
                      }
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancelEdit}
                      disabled={loading?.id === booking.id}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Cancel
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleSaveEdit(booking.id)}
                      disabled={loading?.id === booking.id && loading.action === "edit"}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Save
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}


