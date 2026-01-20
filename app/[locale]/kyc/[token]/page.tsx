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
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '');
    
    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Failed to upload image');
    }
    
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
          <CardDescription className="space-y-4">
            <p>
              Shipping expensive animals, protected species (CITES), or general reptiles often requires identification of the receiving party to ensure compliance with transport laws and to verify you are a real person and not a smuggler.
            </p>
            <p className="text-sm font-medium text-amber-600 dark:text-amber-400">
              Privacy Notice: Your documents are used strictly for legal verification purposes and will be permanently deleted as soon as your identity is confirmed.
            </p>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 p-4 bg-muted rounded-lg border border-border">
            <h3 className="font-semibold mb-2">Shipment Details</h3>
            <p className="text-sm"><span className="text-muted-foreground">Tracking:</span> {kycData.shipmentId.trackingNumber}</p>
            <p className="text-sm"><span className="text-muted-foreground">Content:</span> {kycData.shipmentId.description}</p>
          </div>

          {step === 1 && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-base font-semibold">Front of ID Card</Label>
                    <p className="text-xs text-muted-foreground">Clear photo of the front side of your Government ID.</p>
                  </div>
                  <div className="relative group aspect-[1.6/1] overflow-hidden rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 transition-colors">
                    {previews.idFront ? (
                      <img src={previews.idFront} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full gap-2 text-muted-foreground">
                        <img src="/id_front.jpeg" className="absolute inset-0 w-full h-full object-cover opacity-10 grayscale group-hover:opacity-20 transition-opacity" />
                        <Upload className="h-8 w-8" />
                        <span className="text-xs font-medium">Click to upload front</span>
                      </div>
                    )}
                    <Input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => handleFileChange(e, 'idFront')} 
                      className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-base font-semibold">Back of ID Card</Label>
                    <p className="text-xs text-muted-foreground">Clear photo of the back side of your Government ID.</p>
                  </div>
                  <div className="relative group aspect-[1.6/1] overflow-hidden rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 transition-colors">
                    {previews.idBack ? (
                      <img src={previews.idBack} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full gap-2 text-muted-foreground">
                        <img src="/id_back.jpeg" className="absolute inset-0 w-full h-full object-cover opacity-10 grayscale group-hover:opacity-20 transition-opacity" />
                        <Upload className="h-8 w-8" />
                        <span className="text-xs font-medium">Click to upload back</span>
                      </div>
                    )}
                    <Input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => handleFileChange(e, 'idBack')} 
                      className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />
                <p className="text-xs text-muted-foreground">
                  Ensure all text on your ID is readable and no parts are cut off. We accept Passport, Driver&apos;s License, or National Identity Card.
                </p>
              </div>

              <Button onClick={() => setStep(2)} className="w-full h-12 text-base font-semibold" disabled={!files.idFront || !files.idBack}>
                Continue to Final Step
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-base font-semibold">Selfie with Reptile & Enclosure</Label>
                  <p className="text-sm text-muted-foreground">
                    To verify your capability as a keeper, please take a photo of yourself holding any reptile you currently own, with its enclosure visible in the background.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  <div className="relative group aspect-square overflow-hidden rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 transition-colors">
                    {previews.selfie ? (
                      <img src={previews.selfie} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full gap-2 text-muted-foreground">
                        <Upload className="h-10 w-10" />
                        <span className="text-sm font-medium">Upload your selfie</span>
                      </div>
                    )}
                    <Input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => handleFileChange(e, 'selfie')} 
                      className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    />
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold">Example Shot:</h4>
                    <div className="aspect-square rounded-lg overflow-hidden border border-border bg-muted">
                      <img src="/selfie_reptile.jpeg" className="w-full h-full object-cover opacity-80" alt="Example selfie" />
                    </div>
                    <ul className="text-xs space-y-2 text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-3 w-3 text-green-500" /> Your face must be clearly visible
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-3 w-3 text-green-500" /> Reptile must be in hand
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-3 w-3 text-green-500" /> Enclosure must be visible
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1 h-12">Back</Button>
                <Button onClick={handleSubmit} className="flex-1 h-12 text-base font-semibold" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="animate-spin mr-2 h-5 w-5" />
                      Uploading Documents...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-5 w-5" />
                      Submit Verification
                    </>
                  )}
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