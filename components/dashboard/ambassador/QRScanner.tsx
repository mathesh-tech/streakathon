"use client";

import { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { scanQRTicket } from "@/actions/attendance";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function QRScanner({ onScanSuccess }: { onScanSuccess: (studentId: string, hackathonId: string) => void }) {
  const [isScanning, setIsScanning] = useState(false);
  const [scannerKey, setScannerKey] = useState(0); // Used to force re-render scanner
  const { toast } = useToast();

  useEffect(() => {
    let scanner: Html5QrcodeScanner | null = null;
    
    // We delay the initialization slightly to ensure the DOM element exists
    const initScanner = () => {
      const qrCodeRegionId = "qr-reader";
      if (!document.getElementById(qrCodeRegionId)) return;
      
      scanner = new Html5QrcodeScanner(
        qrCodeRegionId,
        { fps: 10, qrbox: { width: 250, height: 250 } },
        /* verbose= */ false
      );

      scanner.render(
        async (decodedText) => {
          if (isScanning) return; // Prevent multiple rapid scans
          setIsScanning(true);
          
          try {
            // Pause scanner immediately upon read to prevent duplicate readings
            if (scanner) {
                scanner.pause();
            }
            
            // Expected JSON: { token, studentId, hackathonId, expiresAt }
            const payload = JSON.parse(decodedText);
            
            if (!payload.token || !payload.studentId || !payload.hackathonId) {
              throw new Error("Invalid QR code format");
            }

            const res = await scanQRTicket(payload.token);
            
            if (res.success) {
              toast({
                title: "Success",
                description: "Attendance marked successfully.",
              });
              
              if (scanner) {
                scanner.clear();
              }
              onScanSuccess(payload.studentId, payload.hackathonId);
            } else {
              toast({
                title: "Failed to mark attendance",
                description: res.error,
                variant: "destructive"
              });
              if (scanner) scanner.resume();
              setIsScanning(false);
            }
          } catch (e: any) {
            toast({
              title: "Invalid QR",
              description: e.message || "Failed to parse QR code.",
              variant: "destructive"
            });
            if (scanner) scanner.resume();
            setIsScanning(false);
          }
        },
        (error) => {
          // ignore scan failures during continuous scanning
        }
      );
    };

    initScanner();

    return () => {
      if (scanner) {
        scanner.clear().catch(e => console.error("Failed to clear scanner", e));
      }
    };
  }, [toast, isScanning, onScanSuccess, scannerKey]);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Scan QR Ticket</CardTitle>
        <CardDescription>Scan a participant's QR code to mark attendance.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isScanning && (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Processing scan...</span>
          </div>
        )}
        <div id="qr-reader" className={isScanning ? "hidden" : "w-full overflow-hidden"} />
        <Button variant="outline" className="w-full" onClick={() => setScannerKey(k => k + 1)}>
            Restart Scanner
        </Button>
      </CardContent>
    </Card>
  );
}
