"use client";

import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { generateQRTicket } from "@/actions/attendance";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, RefreshCw } from "lucide-react";

export function QRTicketGenerator({ hackathons }: { hackathons: { id: string, title: string }[] }) {
  const [selectedHackathon, setSelectedHackathon] = useState<string>("");
  const [ticket, setTicket] = useState<{ token: string, expiresAt: Date, studentId: string, hackathonId: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (hackathons.length > 0 && !selectedHackathon) {
      setSelectedHackathon(hackathons[0].id);
    }
  }, [hackathons, selectedHackathon]);

  const generateTicket = async () => {
    if (!selectedHackathon) return;
    setIsLoading(true);
    try {
      const res = await generateQRTicket(selectedHackathon);
      if (res.success && res.token) {
        setTicket({
          token: res.token,
          expiresAt: new Date(res.expiresAt),
          studentId: res.studentId,
          hackathonId: res.hackathonId
        });
        toast({
          title: "QR Ticket Generated",
          description: "This ticket is valid for 5 minutes.",
        });
      } else {
        toast({
          title: "Failed to generate ticket",
          description: res.error || "Unknown error",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-refresh the QR code just before it expires
  useEffect(() => {
    if (ticket && ticket.expiresAt) {
      const timeUntilExpiry = ticket.expiresAt.getTime() - Date.now();
      if (timeUntilExpiry > 0) {
        const timer = setTimeout(() => {
          generateTicket();
        }, timeUntilExpiry - 5000); // refresh 5 seconds before expiry
        return () => clearTimeout(timer);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticket]);

  const qrValue = ticket ? JSON.stringify({
    studentId: ticket.studentId,
    hackathonId: ticket.hackathonId,
    token: ticket.token,
    expiresAt: ticket.expiresAt.toISOString(),
  }) : "";

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Attendance QR Code</CardTitle>
        <CardDescription>Generate a one-time QR code to mark your attendance.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {hackathons.length > 0 ? (
          <div className="space-y-4">
            <Select value={selectedHackathon} onValueChange={setSelectedHackathon}>
              <SelectTrigger>
                <SelectValue placeholder="Select Hackathon" />
              </SelectTrigger>
              <SelectContent>
                {hackathons.map((h) => (
                  <SelectItem key={h.id} value={h.id}>
                    {h.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {ticket ? (
              <div className="flex flex-col items-center justify-center space-y-4 p-4 border rounded-lg bg-white">
                <QRCodeSVG value={qrValue} size={200} />
                <p className="text-xs text-muted-foreground text-center">
                  Valid until {ticket.expiresAt.toLocaleTimeString()}
                </p>
                <Button variant="outline" size="sm" onClick={generateTicket} disabled={isLoading} className="w-full">
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
                  Refresh QR Code
                </Button>
              </div>
            ) : (
              <Button onClick={generateTicket} disabled={isLoading || !selectedHackathon} className="w-full">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Generate QR Ticket
              </Button>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center">You are not registered for any upcoming hackathons.</p>
        )}
      </CardContent>
    </Card>
  );
}
