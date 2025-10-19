import * as React from "react";
import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Target, GraduationCap } from 'lucide-react';

interface ProfileData {
  name: string;
  email: string;
  examType: string;
  targetRanking: string;
  targetUniversity: string;
  targetDepartment: string;
  tytGoal: string;
  aytGoal: string;
}

interface TestData {
  tytNet: number;
  aytNet: number;
}

interface ProfileProps {
  user: { name: string; email: string };
  onLogout: () => void;
}

export function Profile({ user }: ProfileProps) {
  const profile = useMemo<ProfileData>(() => {
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
  }, [user]);

  // Calculate statistics from actual data
  const tests: TestData[] = JSON.parse(localStorage.getItem('yks_tests') || '[]');
  const topicStates: Record<string, boolean> = JSON.parse(localStorage.getItem('yks_topic_states') || '{}');
  
  const completedTopics = Object.values(topicStates).filter(Boolean).length;
  const totalTopics = Object.keys(topicStates).length || 1;
  const completionRate = Math.round((completedTopics / totalTopics) * 100);
  
  const allNets = tests.map((t) => Math.max(t.tytNet || 0, t.aytNet || 0));
  const highestNet = allNets.length > 0 ? Math.max(...allNets) : 0;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-slate-800 mb-2">Profil</h1>
        <p className="text-slate-600">Kişisel bilgileriniz ve istatistikleriniz</p>
      </div>

      {/* Profile Info Card */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardContent className="p-8">
          <div className="text-center space-y-4">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-900 to-blue-700 rounded-full mx-auto flex items-center justify-center">
              <span className="text-white text-2xl font-semibold">
                {profile.name.split(' ').map((n: string) => n[0]).filter(Boolean).join('').slice(0, 2)}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-800">{profile.name}</h2>
              <p className="text-slate-600">{profile.email}</p>
            </div>
            <div className="bg-blue-100 text-blue-900 px-4 py-2 rounded-lg inline-block">
              <span className="font-semibold">{profile.examType}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Goals Card */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center gap-1.5">
            <Target className="w-5 h-5 text-blue-900" />
            <CardTitle className="text-lg">Hedeflerim</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <span className="text-slate-700 font-medium">Hedef Sıralama:</span>
              <span className="font-semibold text-slate-800">{profile.targetRanking}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <span className="text-slate-700 font-medium">Hedef Üniversite:</span>
              <span className="font-semibold text-slate-800 text-sm">{profile.targetUniversity}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <span className="text-slate-700 font-medium">Hedef Bölüm:</span>
              <span className="font-semibold text-slate-800 text-sm">{profile.targetDepartment}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <span className="text-slate-700 font-medium">TYT Net Hedefi:</span>
              <span className="font-semibold text-blue-900">{profile.tytGoal}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-blue-100 rounded-lg">
              <span className="text-slate-700 font-medium">AYT Net Hedefi:</span>
              <span className="font-semibold text-blue-700">{profile.aytGoal}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Card */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center gap-1.5">
            <GraduationCap className="w-5 h-5 text-blue-900" />
            <CardTitle className="text-lg">İstatistikler</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-slate-50 rounded-lg">
              <div className="text-2xl font-semibold text-blue-900 mb-1">{tests.length}</div>
              <div className="text-sm text-slate-600">Tamamlanan Deneme</div>
            </div>
            <div className="text-center p-4 bg-slate-50 rounded-lg">
              <div className="text-2xl font-semibold text-green-600 mb-1">%{completionRate}</div>
              <div className="text-sm text-slate-600">Konu Tamamlanma</div>
            </div>
            <div className="text-center p-4 bg-slate-50 rounded-lg col-span-2">
              <div className="text-2xl font-semibold text-orange-600 mb-1">{highestNet}</div>
              <div className="text-sm text-slate-600">En Yüksek Net</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
