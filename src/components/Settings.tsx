import * as React from "react";
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { ArrowLeft, Target, Mail, Lock, LogOut } from 'lucide-react';

interface SettingsProps {
  user: { name: string; email: string };
  onLogout: () => void;
  onBack: () => void;
}

export function Settings({ user, onLogout, onBack }: SettingsProps) {
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('yks_profile');
    return saved ? JSON.parse(saved) : {
      name: user.name,
      email: user.email,
      examType: 'SAY',
      targetRanking: '5000',
      targetUniversity: 'İstanbul Teknik Üniversitesi',
      targetDepartment: 'Bilgisayar Mühendisliği',
      tytGoal: '100',
      aytGoal: '50'
    };
  });

  const handleSaveProfile = () => {
    localStorage.setItem('yks_profile', JSON.stringify(profile));
    alert('Profil bilgileri kaydedildi!');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="hover:bg-blue-100"
        >
          <ArrowLeft className="w-5 h-5 text-blue-900" />
        </Button>
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Ayarlar</h1>
          <p className="text-slate-600">Profil bilgilerinizi düzenleyin</p>
        </div>
      </div>

      {/* Profile Settings */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg">Profil Bilgileri</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Ad Soyad</Label>
            <Input
              id="name"
              value={profile.name}
              onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="examType">Sınav Alanı</Label>
            <div className="flex space-x-2">
              {['SAY', 'EA', 'SÖZ', 'DİL'].map(type => (
                <Button
                  key={type}
                  type="button"
                  variant={profile.examType === type ? 'default' : 'outline'}
                  onClick={() => setProfile(prev => ({ ...prev, examType: type }))}
                  className="flex-1"
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ranking">Hedef Sıralama</Label>
            <Input
              id="ranking"
              value={profile.targetRanking}
              onChange={(e) => setProfile(prev => ({ ...prev, targetRanking: e.target.value }))}
              placeholder="Örn: 5000"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="university">Hedef Üniversite</Label>
            <Input
              id="university"
              value={profile.targetUniversity}
              onChange={(e) => setProfile(prev => ({ ...prev, targetUniversity: e.target.value }))}
              placeholder="Örn: İstanbul Teknik Üniversitesi"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">Hedef Bölüm</Label>
            <Input
              id="department"
              value={profile.targetDepartment}
              onChange={(e) => setProfile(prev => ({ ...prev, targetDepartment: e.target.value }))}
              placeholder="Örn: Bilgisayar Mühendisliği"
            />
          </div>
        </CardContent>
      </Card>

      {/* Net Goals */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center gap-1.5">
            <Target className="w-5 h-5 text-blue-900" />
            <CardTitle className="text-lg">Net Hedefleri</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tytGoal">TYT Net Hedefi</Label>
            <Input
              id="tytGoal"
              type="number"
              value={profile.tytGoal}
              onChange={(e) => setProfile(prev => ({ ...prev, tytGoal: e.target.value }))}
              placeholder="Örn: 100"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="aytGoal">AYT Net Hedefi</Label>
            <Input
              id="aytGoal"
              type="number"
              value={profile.aytGoal}
              onChange={(e) => setProfile(prev => ({ ...prev, aytGoal: e.target.value }))}
              placeholder="Örn: 50"
            />
          </div>

          <Button type="button" onClick={handleSaveProfile} className="w-full bg-blue-900 hover:bg-blue-800">
            Değişiklikleri Kaydet
          </Button>
        </CardContent>
      </Card>

      {/* Account Settings */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg">Hesap Ayarları</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button type="button" variant="outline" className="w-full justify-start">
            <Mail className="w-4 h-4 mr-2" />
            E-posta Değiştir
          </Button>

          <Button type="button" variant="outline" className="w-full justify-start">
            <Lock className="w-4 h-4 mr-2" />
            Şifre Değiştir
          </Button>

          <Separator />

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
                <LogOut className="w-4 h-4 mr-2" />
                Çıkış Yap
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Çıkış yapmak istediğinizden emin misiniz?</AlertDialogTitle>
                <AlertDialogDescription>
                  Hesabınızdan çıkış yapacaksınız. Tekrar giriş yapmak için e-posta ve şifrenizi girmeniz gerekecek.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>İptal</AlertDialogCancel>
                <AlertDialogAction onClick={onLogout} className="bg-red-600 hover:bg-red-700">
                  Çıkış Yap
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}
