"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import { TourItem } from "@/types/tour";
import { useState } from "react";

interface BookingFormState {
    name: string;
    email: string;
    phone: string;
    bookingDate: string;
    returnDate: string;
    numberOfPeople: string;
    specialRequests: string;
}

const defaultForm: BookingFormState = {
    name: "",
    email: "",
    phone: "",
    bookingDate: "",
    returnDate: "",
    numberOfPeople: "1",
    specialRequests: "",
};

interface TourBookingDialogProps {
    tour: TourItem | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function TourBookingDialog({ tour, open, onOpenChange }: TourBookingDialogProps) {
    const [formData, setFormData] = useState<BookingFormState>(defaultForm);
    const [submitting, setSubmitting] = useState(false);
    const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

    const supabase = createClient();

    const handleFormChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = event.target;
        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleBookingSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!tour) {
            return;
        }

        if (!formData.name.trim() || !formData.email.trim() || !formData.bookingDate) {
            setFeedback({ type: "error", message: "Please fill in the required fields." });
            return;
        }

        setSubmitting(true);
        setFeedback(null);

        const peopleCount = Number.parseInt(formData.numberOfPeople || "1", 10);
        const priceNumber = tour.price ? Number(tour.price) : null;
        const totalAmount = priceNumber !== null && !Number.isNaN(priceNumber)
            ? priceNumber * (Number.isNaN(peopleCount) ? 1 : peopleCount)
            : null;

        const { error } = await supabase.from("bookings").insert([
            {
                tour_id: tour.id,
                booking_type: "tour",
                booking_date: formData.bookingDate,
                return_date: formData.returnDate || null,
                number_of_people: Number.isNaN(peopleCount) ? 1 : peopleCount,
                total_amount: totalAmount,
                contact_email: formData.email.trim(),
                contact_phone: formData.phone.trim() || null,
                special_requests: formData.specialRequests.trim() || null,
                status: "pending",
            },
        ]);

        if (error) {
            let message = error.message;
            if (message.includes("row-level security")) {
                message =
                    "Permission denied. Please ensure bookings table RLS policies allow public inserts.";
            }
            setFeedback({ type: "error", message });
            setSubmitting(false);
            return;
        }

        setSubmitting(false);
        setFeedback({ type: "success", message: "Booking submitted! We will contact you soon." });

        // Close modal after 2 seconds on success
        setTimeout(() => {
            setFormData(defaultForm);
            setFeedback(null);
            onOpenChange(false);
        }, 2000);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {tour?.title}
                    </DialogTitle>
                    <DialogDescription>
                        Fill in the details to complete your tour booking
                    </DialogDescription>
                </DialogHeader>
                {tour && (
                    <form onSubmit={handleBookingSubmit} className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="modal-name">Full Name *</Label>
                                <Input
                                    id="modal-name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleFormChange}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="modal-email">Email *</Label>
                                <Input
                                    id="modal-email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleFormChange}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="modal-phone">Phone</Label>
                                <Input
                                    id="modal-phone"
                                    name="phone"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={handleFormChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="modal-numberOfPeople">Number of People</Label>
                                <Input
                                    id="modal-numberOfPeople"
                                    name="numberOfPeople"
                                    type="number"
                                    min="1"
                                    value={formData.numberOfPeople}
                                    onChange={handleFormChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="modal-bookingDate">Start Date *</Label>
                                <Input
                                    id="modal-bookingDate"
                                    name="bookingDate"
                                    type="date"
                                    value={formData.bookingDate}
                                    onChange={handleFormChange}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="modal-returnDate">End Date</Label>
                                <Input
                                    id="modal-returnDate"
                                    name="returnDate"
                                    type="date"
                                    value={formData.returnDate}
                                    onChange={handleFormChange}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="modal-specialRequests">Special Requests</Label>
                            <Textarea
                                id="modal-specialRequests"
                                name="specialRequests"
                                placeholder="Let us know if you have any specific requirements"
                                value={formData.specialRequests}
                                onChange={handleFormChange}
                                rows={4}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Button type="submit" disabled={submitting}>
                                {submitting ? "Submitting..." : "Submit Booking"}
                            </Button>
                            {feedback && (
                                <p
                                    className={
                                        feedback.type === "success"
                                            ? "text-sm text-green-600"
                                            : "text-sm text-destructive"
                                    }
                                >
                                    {feedback.message}
                                </p>
                            )}
                        </div>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
