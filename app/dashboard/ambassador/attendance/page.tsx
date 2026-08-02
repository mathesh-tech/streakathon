"use client";

import { useState } from "react";
import { QRScanner } from "@/components/dashboard/ambassador/QRScanner";
import { EvaluationForm } from "@/components/dashboard/ambassador/EvaluationForm";
import { Button } from "@/components/ui/button";
import { getStudentBasicInfo } from "@/actions/student";

export default function AttendancePage() {
  const [scannedStudent, setScannedStudent] = useState<{ studentId: string; hackathonId: string; name: string } | null>(null);

  const handleScanSuccess = async (studentId: string, hackathonId: string) => {
    const res = await getStudentBasicInfo(studentId);
    setScannedStudent({ 
      studentId, 
      hackathonId, 
      name: res.success && res.name ? res.name : "Participant"
    });
  };

  return (
    <div className="flex-1 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">QR Attendance Scanner</h1>
        {scannedStudent && (
            <Button variant="outline" onClick={() => setScannedStudent(null)}>
                Scan Another Participant
            </Button>
        )}
      </div>

      {!scannedStudent ? (
        <div className="flex justify-center mt-12">
            <QRScanner onScanSuccess={handleScanSuccess} />
        </div>
      ) : (
        <div className="mt-8">
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 p-4 rounded-lg mb-8 text-center font-medium">
                Attendance marked successfully! Please evaluate the participant's performance.
            </div>
            <EvaluationForm 
                studentId={scannedStudent.studentId} 
                hackathonId={scannedStudent.hackathonId} 
                studentName={scannedStudent.name} 
            />
        </div>
      )}
    </div>
  );
}
