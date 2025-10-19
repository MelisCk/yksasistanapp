import * as React from "react";
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Clock, Target, TrendingUp, BookOpen } from 'lucide-react';

const COLORS = ['#1e3a8a', '#1d4ed8'];

interface TestData {
  id: number;
  type: 'TYT' | 'AYT';
  tytNet: number;
  aytNet: number;
  date: string;
}

interface ProfileData {
  tytGoal: string;
  aytGoal: string;
  examType?: string;
  targetUniversity?: string;
  targetDepartment?: string;
}

interface DashboardProps {
  user: { name: string; email: string };
}

export function Dashboard({ user }: DashboardProps) {
  const [tests, setTests] = useState<TestData[]>([]);
  const [topicStates, setTopicStates] = useState<Record<string, boolean>>({});
  const [profile, setProfile] = useState<ProfileData>({ tytGoal: '100', aytGoal: '50' });

  useEffect(() => {
    // Load data from localStorage
    const savedTests = localStorage.getItem('yks_tests');
    const savedTopics = localStorage.getItem('yks_topic_states');
    const savedProfile = localStorage.getItem('yks_profile');

    if (savedTests) setTests(JSON.parse(savedTests));
    if (savedTopics) setTopicStates(JSON.parse(savedTopics));
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    } else {
      setProfile({ tytGoal: '100', aytGoal: '50' });
    }
  }, []);

  // Geri sayım hesaplama (örnek: 2025 YKS tarihi)
  const examDate = new Date('2025-06-15');
  const now = new Date();
  const timeDiff = examDate.getTime() - now.getTime();
  const days = Math.max(0, Math.floor(timeDiff / (1000 * 3600 * 24)));
  const hours = Math.max(0, Math.floor((timeDiff % (1000 * 3600 * 24)) / (1000 * 3600)));
  const minutes = Math.max(0, Math.floor((timeDiff % (1000 * 3600)) / (1000 * 60)));

  // Calculate subject completion percentages
  const tytTopics = [
    'Ses Bilgisi', 'Sözcükte Anlam', 'Cümle Bilgisi', 'Anlatım Bozuklukları', 'Yazım Kuralları',
    'Ana Düşünce', 'Anlam İlişkileri', 'Cümle Sıralaması', 'Paragraf Tamamlama', 'Bağdaşıklık',
    'İlk ve Orta Çağ', 'Yeni Çağ', 'Yakın Çağ', 'Osmanlı Tarihi', 'Atatürk İlkeleri',
    'Doğal Sistemler', 'Beşeri Sistemler', 'Türkiye Coğrafyası', 'Harita Bilgisi', 'Çevre ve Toplum',
    'Kur\'an', 'İnanç Esasları', 'İbadetler', 'Hz. Muhammed', 'İslam Ahlakı',
    'Felsefe Nedir', 'Bilgi Felsefesi', 'Ahlak Felsefesi', 'Siyaset Felsefesi', 'Mantık',
    'Temel Kavramlar', 'Sayılar', 'Cebir', 'Fonksiyonlar', 'Denklemler',
    'Üçgenler', 'Dörtgenler', 'Çember', 'Analitik Geometri',
    'Kuvvet ve Hareket', 'Enerji', 'Isı ve Sıcaklık', 'Elektrik', 'Dalgalar',
    'Atom', 'Periyodik Sistem', 'Kimyasal Bağlar', 'Asit-Baz', 'Kimyasal Tepkimeler',
    'Hücre', 'Canlılar Dünyası', 'Üreme ve Gelişme', 'Kalıtım', 'Ekoloji'
  ];

  const aytTopics = [
    'Divan Edebiyatı', 'Tanzimat Edebiyatı', 'Servet-i Fünun', 'Milli Edebiyat', 'Cumhuriyet Edebiyatı',
    'Osmanlı Devleti Kuruluş', 'Osmanlı Yükseliş', 'Osmanlı Duraklama', 'Osmanlı Gerileme',
    'Osmanlı Yenileşme', 'Milli Mücadele', 'Atatürk Dönemi', 'Çağdaş Türkiye',
    'Fiziki Coğrafya', 'İklim', 'Bitki Örtüsü', 'Su Kaynakları',
    'Beşeri Coğrafya', 'Ekonomik Coğrafya', 'Türkiye Beşeri', 'Küresel Ortam',
    'Din Felsefesi', 'Sanat Felsefesi', 'Bilim Felsefesi', 'Felsefe Tarihi',
    'Tefsir', 'Hadis', 'İslam Düşünce Tarihi', 'Din Psikolojisi', 'Din Sosyolojisi',
    'Trigonometri', 'Logaritma', 'Diziler', 'Limit', 'Türev', 'İntegral',
    'Vektörler', 'Koordinat Sistemi', 'Katı Geometri',
    'Modern Fizik', 'Elektrik ve Manyetizma', 'Optik', 'Atom Fiziği', 'Çekim Kuvveti',
    'Kimyasal Denge', 'Asit-Baz Dengeleri', 'Çözünürlük', 'Elektrokimya', 'Organik Kimya',
    'Canlılarda Enerji', 'Sinir Sistemi', 'Duyu Organları', 'Endokrin Sistem', 'Üreme Sistemi', 'Genetik'
  ];

  const tytCompleted = tytTopics.filter(topic => topicStates[topic]).length;
  const aytCompleted = aytTopics.filter(topic => topicStates[topic]).length;
  const tytPercentage = Math.round((tytCompleted / tytTopics.length) * 100);
  const aytPercentage = Math.round((aytCompleted / aytTopics.length) * 100);

  const subjectData = [
    { name: 'TYT', completed: tytPercentage, total: 100 },
    { name: 'AYT', completed: aytPercentage, total: 100 }
  ];

  // Prepare chart data for TYT and AYT
  const tytTests = tests.filter(t => t.type === 'TYT');
  const aytTests = tests.filter(t => t.type === 'AYT');

  const tytChartData = tytTests.length > 0 ? tytTests.map((test, index) => ({
    name: new Date(test.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' }),
    net: test.tytNet,
    target: parseInt(profile.tytGoal) || 100,
    date: test.date
  })) : [{ name: '', net: 0, target: 0 }];

  const aytChartData = aytTests.length > 0 ? aytTests.map((test, index) => ({
    name: new Date(test.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' }),
    net: test.aytNet,
    target: parseInt(profile.aytGoal) || 50,
    date: test.date
  })) : [{ name: '', net: 0, target: 0 }];

  return (
    <div className="space-y-6">
      {/* Geri Sayım Kartı */}
      <Card className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 border-0 text-white shadow-xl">
        <CardContent className="p-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-1.5">
              <Clock className="w-6 h-6" />
              <h2 className="text-2xl font-semibold">YKS'ye Kalan Süre</h2>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm">
                <div className="text-3xl font-bold">{days}</div>
                <div className="text-sm opacity-90">Gün</div>
              </div>
              <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm">
                <div className="text-3xl font-bold">{hours}</div>
                <div className="text-sm opacity-90">Saat</div>
              </div>
              <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm">
                <div className="text-3xl font-bold">{minutes}</div>
                <div className="text-sm opacity-90">Dakika</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orta Bölüm - Konu Takip ve Profil */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Konu Takip Kartı */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-1.5">
              <BookOpen className="w-5 h-5 text-blue-900" />
              <CardTitle className="text-lg">Konu Takip</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {subjectData.map((subject, index) => (
                <div key={subject.name} className="text-center space-y-2">
                  <h4 className="font-medium text-slate-700">{subject.name}</h4>
                  <div className="w-20 h-20 mx-auto">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { value: subject.completed },
                            { value: subject.total - subject.completed }
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={25}
                          outerRadius={35}
                          dataKey="value"
                        >
                          <Cell fill={COLORS[index]} />
                          <Cell fill="#e2e8f0" />
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-sm text-slate-600">%{subject.completed}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Profil Kartı */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-1.5">
              <Target className="w-5 h-5 text-blue-900" />
              <CardTitle className="text-lg">Profil</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-900 to-blue-700 rounded-full mx-auto flex items-center justify-center">
                <span className="text-white text-xl font-semibold">
                  {user.name.split(' ').map(n => n[0]).filter(Boolean).join('').slice(0, 2)}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">{user.name}</h3>
                <p className="text-sm text-slate-600">
                  {profile.targetUniversity || 'İTÜ'} - {profile.targetDepartment || 'Bilgisayar Mühendisliği'}
                </p>
              </div>
              <div className="bg-blue-100 text-blue-900 px-4 py-2 rounded-lg inline-block">
                <span className="font-semibold">{profile.examType || 'SAY'}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Deneme Sonuçları Kartı */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-5 h-5 text-blue-900" />
            <CardTitle className="text-lg">Deneme Gelişimi</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-slate-700 mb-3 text-center">TYT</h4>
              <div className="h-32">
                {tytTests.length === 0 ? (
                  <div className="h-full flex items-center justify-center relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={[{ name: '', net: 0 }]}>
                        <XAxis dataKey="name" stroke="#cbd5e1" fontSize={12} />
                        <YAxis stroke="#cbd5e1" fontSize={12} />
                        <Line 
                          type="monotone" 
                          dataKey="net" 
                          stroke="#cbd5e1" 
                          strokeWidth={2}
                          strokeDasharray="5 5"
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                    <p className="absolute text-xs text-slate-400">Henüz deneme yok</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={tytChartData}>
                      <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                      <YAxis stroke="#64748b" fontSize={10} />
                      <Tooltip 
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-white p-2 rounded shadow-lg border text-xs">
                                <p className="font-medium">{payload[0].payload.name}</p>
                                <p className="text-blue-900">Net: {payload[0].value}</p>
                                <p className="text-orange-600">Hedef: {payload[0].payload.target}</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="net" 
                        stroke="#1e3a8a" 
                        strokeWidth={3}
                        dot={{ fill: '#1e3a8a', r: 4 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="target" 
                        stroke="#f59e0b" 
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={{ fill: '#f59e0b', r: 3 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
            <div>
              <h4 className="font-medium text-slate-700 mb-3 text-center">AYT</h4>
              <div className="h-32">
                {aytTests.length === 0 ? (
                  <div className="h-full flex items-center justify-center relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={[{ name: '', net: 0 }]}>
                        <XAxis dataKey="name" stroke="#cbd5e1" fontSize={12} />
                        <YAxis stroke="#cbd5e1" fontSize={12} />
                        <Line 
                          type="monotone" 
                          dataKey="net" 
                          stroke="#cbd5e1" 
                          strokeWidth={2}
                          strokeDasharray="5 5"
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                    <p className="absolute text-xs text-slate-400">Henüz deneme yok</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={aytChartData}>
                      <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                      <YAxis stroke="#64748b" fontSize={10} />
                      <Tooltip 
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-white p-2 rounded shadow-lg border text-xs">
                                <p className="font-medium">{payload[0].payload.name}</p>
                                <p className="text-blue-700">Net: {payload[0].value}</p>
                                <p className="text-orange-600">Hedef: {payload[0].payload.target}</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="net" 
                        stroke="#1d4ed8" 
                        strokeWidth={3}
                        dot={{ fill: '#1d4ed8', r: 4 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="target" 
                        stroke="#f59e0b" 
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={{ fill: '#f59e0b', r: 3 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
