"use client";

import { useMemo, useState } from "react";

import { Navigation } from "@/components/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { Car, Fuel, Users } from "lucide-react";
import Image from "next/image";

interface VehicleRentalListProps {
  vehicles: VehicleItem[];
}

interface VehicleItem {
  id: string;
  name: string;
  type: string;
  capacity: number | null;
  fuel_type: string | null;
  price_per_day: number | string | null;
  features: string[] | null;
  suitable_for: string | null;
  image_url: string | null;
  is_available: boolean;
}

interface RentalFormState {
  pickupDate: string;
  returnDate: string;
  pickupLocation: string;
  name: string;
  email: string;
  phone: string;
  license: string;
}

const defaultForm: RentalFormState = {
  pickupDate: "",
  returnDate: "",
  pickupLocation: "",
  name: "",
  email: "",
  phone: "",
  license: "",
};

export function VehicleRentalList({ vehicles }: VehicleRentalListProps) {
  const supabase = createClient();
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [formData, setFormData] = useState<RentalFormState>(defaultForm);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const availableVehicles = useMemo(
    () => vehicles.filter((vehicle) => vehicle.is_available),
    [vehicles],
  );

  const handleSelectVehicle = (id: string) => {
    setSelectedVehicleId(id);
    setFormData(defaultForm);
    setFeedback(null);
  };

  const handleCloseBooking = () => {
    setSelectedVehicleId(null);
    setFormData(defaultForm);
    setFeedback(null);
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedVehicleId) {
      setFeedback({ type: "error", message: "Please select a vehicle." });
      return;
    }

    if (!formData.pickupDate || !formData.returnDate) {
      setFeedback({ type: "error", message: "Pickup and return dates are required." });
      return;
    }

    if (!formData.name.trim() || !formData.email.trim()) {
      setFeedback({ type: "error", message: "Name and email are required." });
      return;
    }

    const vehicle = vehicles.find((item) => item.id === selectedVehicleId);
    if (!vehicle) {
      setFeedback({ type: "error", message: "Unable to find selected vehicle." });
      return;
    }

    setSubmitting(true);
    setFeedback(null);

    const priceNumber = vehicle.price_per_day ? Number(vehicle.price_per_day) : null;

    const { error } = await supabase.from("bookings").insert([
      {
        vehicle_id: vehicle.id,
        booking_type: "vehicle",
        booking_date: formData.pickupDate,
        return_date: formData.returnDate,
        total_amount: priceNumber,
        contact_email: formData.email.trim(),
        contact_phone: formData.phone.trim() || null,
        special_requests: `Pickup: ${formData.pickupLocation || "N/A"}. License: ${formData.license || "N/A"}`,
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
    setFeedback({ type: "success", message: "Vehicle booking submitted!" });

    // Close modal after 2 seconds on success
    setTimeout(() => {
      setFormData(defaultForm);
      setSelectedVehicleId(null);
      setFeedback(null);
    }, 2000);
  };

  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">Vehicle Rental</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Rent a vehicle to explore Sri Lanka at your own pace. Choose from our wide range of vehicles
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableVehicles.map((vehicle) => {
              const priceNumber = vehicle.price_per_day ? Number(vehicle.price_per_day) : null;
              return (
                <Card
                  key={vehicle.id}
                  className="overflow-hidden hover:shadow-lg transition-all flex flex-col"
                >
                  {vehicle.image_url ? (
                    <div className="relative h-48 w-full bg-gradient-to-br from-primary/20 to-secondary/20">
                      <Image
                        src={vehicle.image_url}
                        alt={vehicle.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/10" />
                    </div>
                  ) : (
                    <div className="relative h-48 w-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                      <Car className="h-16 w-16 text-primary/50" />
                    </div>
                  )}
                  <CardHeader>
                    <div className="mb-2 flex items-center gap-3">
                      <Car className="h-6 w-6 text-primary" />
                      <CardTitle className="text-xl">{vehicle.name}</CardTitle>
                    </div>
                    <CardDescription className="text-base font-medium text-foreground">
                      {vehicle.type}
                    </CardDescription>
                    <CardDescription>
                      {vehicle.suitable_for || "Perfect for your journeys across Sri Lanka."}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2 text-sm text-muted-foreground">
                      {vehicle.capacity && (
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          <span>Capacity: {vehicle.capacity} persons</span>
                        </div>
                      )}
                      {vehicle.fuel_type && (
                        <div className="flex items-center gap-2">
                          <Fuel className="h-4 w-4" />
                          <span>Fuel: {vehicle.fuel_type}</span>
                        </div>
                      )}
                      {vehicle.features && vehicle.features.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2">
                          {vehicle.features.map((feature) => (
                            <Badge key={feature} variant="secondary">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="pt-4 border-t flex items-center justify-between">
                      <div className="text-2xl font-bold">
                        {priceNumber !== null && !Number.isNaN(priceNumber)
                          ? `$${priceNumber.toFixed(2)}/day`
                          : "Contact"}
                      </div>
                      <Button onClick={() => handleSelectVehicle(vehicle.id)}>
                        Rent Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {availableVehicles.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No vehicles available at the moment.</p>
              </CardContent>
            </Card>
          )}

        </div>
      </div>

      {/* Booking Modal */}
      <Dialog open={selectedVehicleId !== null} onOpenChange={(open) => !open && handleCloseBooking()}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedVehicleId && vehicles.find((v) => v.id === selectedVehicleId)?.name}
            </DialogTitle>
            <DialogDescription>
              Fill in the details to complete your vehicle rental booking
            </DialogDescription>
          </DialogHeader>
          {selectedVehicleId && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="modal-pickupDate">Pickup Date *</Label>
                  <Input
                    id="modal-pickupDate"
                    name="pickupDate"
                    type="date"
                    value={formData.pickupDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="modal-returnDate">Return Date *</Label>
                  <Input
                    id="modal-returnDate"
                    name="returnDate"
                    type="date"
                    value={formData.returnDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="modal-pickupLocation">Pickup Location</Label>
                  <Input
                    id="modal-pickupLocation"
                    name="pickupLocation"
                    placeholder="Enter pickup location"
                    value={formData.pickupLocation}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="modal-name">Full Name *</Label>
                  <Input
                    id="modal-name"
                    name="name"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="modal-email">Email *</Label>
                  <Input
                    id="modal-email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="modal-phone">Phone Number</Label>
                  <Input
                    id="modal-phone"
                    name="phone"
                    type="tel"
                    placeholder="Enter your phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="modal-license">Driving License Number</Label>
                <Input
                  id="modal-license"
                  name="license"
                  placeholder="Enter driving license number"
                  value={formData.license}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Submitting..." : "Confirm Booking"}
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
    </div>
  );
}


