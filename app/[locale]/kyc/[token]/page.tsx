'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Loader2, Upload, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function KYCPage() {
  const { token } = useParams();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [kycData, setKycData] = useState<any>(null);
  const [files, setFiles] = useState({
    idFront: null as File | null,
    idBack: null as File | null,
    selfie: null as File | null,
  });
  const [previews, setPreviews] = useState({
    idFront: '',
    idBack: '',
    selfie: '',
  });

  useEffect(() => {
    const fetchKYC = async () => {
      try {
        const res = await fetch(`/api/kyc/submit?token=${token}`);
        if (!res.ok) throw new Error('Invalid or expired link');
        const data = await res.ok ? await res.json() : null;
        setKycData(data);
      } catch (err: any) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchKYC();
  }, [token]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: keyof typeof files) => {
    const file = e.target.files?.[0];
    if (file) {
      setFiles(prev => ({ ...prev, [type]: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews(prev => ({ ...prev, [type]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || process.env.CLOUDINARY_UPLOAD_PRESET || '');
    
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME;
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    return data.secure_url;
  };

  const handleSubmit = async () => {
    if (!files.idFront || !files.idBack || !files.selfie) {
      toast.error('Please upload all required photos');
      return;
    }

    setSubmitting(true);
    try {
      const [idFrontUrl, idBackUrl, selfieUrl] = await Promise.all([
        uploadToCloudinary(files.idFront),
        uploadToCloudinary(files.idBack),
        uploadToCloudinary(files.selfie),
      ]);

      const res = await fetch('/api/kyc/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          idFrontUrl,
          idBackUrl,
          selfieUrl,
        }),
      });

      if (!res.ok) throw new Error('Failed to submit KYC');
      setStep(3);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin" /></div>;
  if (!kycData) return <div className="flex items-center justify-center min-h-screen text-red-500">Invalid verification link.</div>;

  return (
    <div className="container max-w-2xl py-12 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Identity Verification</CardTitle>
          <CardDescription>
            Shipping expensive animals, protected species (CITES), or general reptiles often requires identification of the receiving party to ensure compliance with transport laws and to verify you are a real person and not a smuggler.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2">Shipment Details</h3>
            <p className="text-sm">Tracking: {kycData.shipmentId.trackingNumber}</p>
            <p className="text-sm">Content: {kycData.shipmentId.description}</p>
          </div>

          {step === 1 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <Label>Front of ID Card</Label>
                <div className="flex items-center gap-4">
                  <Input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'idFront')} />
                  {previews.idFront && <img src={previews.idFront} className="h-20 w-20 object-cover rounded" />}
                </div>
              </div>
              <div className="space-y-4">
                <Label>Back of ID Card</Label>
                <div className="flex items-center gap-4">
                  <Input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'idBack')} />
                  {previews.idBack && <img src={previews.idBack} className="h-20 w-20 object-cover rounded" />}
                </div>
              </div>
              <Button onClick={() => setStep(2)} className="w-full" disabled={!files.idFront || !files.idBack}>Next Step</Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <Label>Selfie with Reptile & Enclosure</Label>
                <p className="text-xs text-muted-foreground">Please take a selfie holding any reptile you currently own in front of its enclosure.</p>
                <div className="flex flex-col items-center gap-4">
                  <Input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'selfie')} />
                  {previews.selfie && <img src={previews.selfie} className="w-full max-h-64 object-cover rounded-lg" />}
                </div>
              </div>
              <div className="flex gap-4">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">Back</Button>
                <Button onClick={handleSubmit} className="flex-1" disabled={submitting}>
                  {submitting ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Upload className="mr-2 h-4 w-4" />}
                  Submit Verification
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-8 space-y-4">
              <CheckCircle2 className="mx-auto h-16 w-16 text-green-500" />
              <h2 className="text-2xl font-bold">KYC Submitted</h2>
              <p className="text-muted-foreground">Your identity verification is awaiting approval. We will process your shipment once verified.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}