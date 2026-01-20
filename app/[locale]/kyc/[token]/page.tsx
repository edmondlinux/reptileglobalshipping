'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Loader2, Upload, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function KYCPage() {
  const t = useTranslations('KYC');
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
          <CardTitle className="text-2xl">{t('title')}</CardTitle>
          <CardDescription className="space-y-4">
            <p>
              {t('description')}
            </p>
            <p className="text-sm font-medium text-amber-600 dark:text-amber-400">
              {t('privacyNotice')}
            </p>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 p-4 bg-muted rounded-lg border border-border">
            <h3 className="font-semibold mb-2">{t('shipmentDetails')}</h3>
            <p className="text-sm"><span className="text-muted-foreground">{t('tracking')}:</span> {kycData.shipmentId.trackingNumber}</p>
            <p className="text-sm"><span className="text-muted-foreground">{t('content')}:</span> {kycData.shipmentId.description}</p>
          </div>

          {step === 1 && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* ID Front */}
                <div className="space-y-4">
                  <div className="space-y-2 text-center md:text-left">
                    <Label className="text-base font-semibold">{t('idFront')}</Label>
                    <p className="text-xs text-muted-foreground">{t('idFrontDesc')}</p>
                  </div>
                  <div className="space-y-3">
                    <div className="aspect-[1.6/1] rounded-lg overflow-hidden border bg-muted">
                      <img src="/id_front.jpeg" className="w-full h-full object-cover opacity-50" alt="ID Front Example" />
                    </div>
                    <div className="space-y-2">
                      <Input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => handleFileChange(e, 'idFront')} 
                        className="cursor-pointer"
                      />
                      {previews.idFront && (
                        <div className="mt-2 p-2 bg-primary/5 rounded border border-primary/20">
                          <p className="text-[10px] font-medium uppercase text-primary mb-1">{t('preview')}:</p>
                          <img src={previews.idFront} className="w-full aspect-[1.6/1] object-cover rounded shadow-sm" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* ID Back */}
                <div className="space-y-4">
                  <div className="space-y-2 text-center md:text-left">
                    <Label className="text-base font-semibold">{t('idBack')}</Label>
                    <p className="text-xs text-muted-foreground">{t('idBackDesc')}</p>
                  </div>
                  <div className="space-y-3">
                    <div className="aspect-[1.6/1] rounded-lg overflow-hidden border bg-muted">
                      <img src="/id_back.jpeg" className="w-full h-full object-cover opacity-50" alt="ID Back Example" />
                    </div>
                    <div className="space-y-2">
                      <Input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => handleFileChange(e, 'idBack')} 
                        className="cursor-pointer"
                      />
                      {previews.idBack && (
                        <div className="mt-2 p-2 bg-primary/5 rounded border border-primary/20">
                          <p className="text-[10px] font-medium uppercase text-primary mb-1">{t('preview')}:</p>
                          <img src={previews.idBack} className="w-full aspect-[1.6/1] object-cover rounded shadow-sm" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />
                <p className="text-xs text-muted-foreground">
                  {t('requirements')}
                </p>
              </div>

              <Button onClick={() => setStep(2)} className="w-full h-12 text-base font-semibold" disabled={!files.idFront || !files.idBack}>
                {t('continue')}
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-base font-semibold">{t('selfieTitle')}</Label>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t('selfieDesc')}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => handleFileChange(e, 'selfie')} 
                        className="cursor-pointer h-12"
                      />
                      {previews.selfie && (
                        <div className="mt-4 p-2 bg-primary/5 rounded border border-primary/20">
                          <p className="text-[10px] font-medium uppercase text-primary mb-2">{t('yourUpload')}:</p>
                          <img src={previews.selfie} className="w-full aspect-square object-cover rounded shadow-md" />
                        </div>
                      )}
                    </div>
                    
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <h4 className="text-xs font-bold uppercase tracking-wider mb-3 text-muted-foreground">{t('reqList')}:</h4>
                      <ul className="text-xs space-y-2.5">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0" /> {t('reqFace')}
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0" /> {t('reqReptile')}
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0" /> {t('reqEnclosure')}
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-center text-muted-foreground">{t('exampleShot')}:</p>
                    <div className="aspect-square rounded-xl overflow-hidden border-2 border-muted bg-muted shadow-inner">
                      <img src="/selfie_reptile.jpeg" className="w-full h-full object-cover grayscale-[20%]" alt="Example selfie" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1 h-12">{t('back')}</Button>
                <Button onClick={handleSubmit} className="flex-1 h-12 text-base font-semibold shadow-lg shadow-primary/20" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="animate-spin mr-2 h-5 w-5" />
                      {t('submitting')}
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-5 w-5" />
                      {t('submit')}
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-8 space-y-4">
              <CheckCircle2 className="mx-auto h-16 w-16 text-green-500" />
              <h2 className="text-2xl font-bold">{t('submittedTitle')}</h2>
              <p className="text-muted-foreground">{t('submittedDesc')}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}