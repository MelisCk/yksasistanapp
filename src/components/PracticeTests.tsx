import * as React from "react";
import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from './ui/dialog';
import { Badge } from './ui/badge';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Plus, Target, TrendingUp, Calendar, Trash2, Pencil } from 'lucide-react';

interface TestData {
  id: number;
  name: string;
  type: 'TYT' | 'AYT';
  date: string;
  tytNet: number;
  aytNet: number;
  subjects?: any;
}

const TYT_SUBJECTS_DETAILED = [
  { name: 'Dil Bilgisi', questions: 10 },
  { name: 'Paragraf', questions: 10 },
  { name: 'Tarih', questions: 5 },
  { name: 'Coğrafya', questions: 5 },
  { name: 'Din', questions: 5 },
  { name: 'Felsefe', questions: 5 },
  { name: 'Matematik', questions: 30 },
  { name: 'Geometri', questions: 10 },
  { name: 'Fizik', questions: 7 },
  { name: 'Kimya', questions: 7 },
  { name: 'Biyoloji', questions: 6 }
];

const TYT_SUBJECTS_GENERAL = [
  { name: 'Türkçe', questions: 40 },
  { name: 'Matematik', questions: 40 },
  { name: 'Sosyal', questions: 20 },
  { name: 'Fen', questions: 20 }
];

const AYT_SUBJECTS_DETAILED = [
  { name: 'Edebiyat', questions: 24 },
  { name: 'Tarih-1', questions: 5 },
  { name: 'Tarih-2', questions: 5 },
  { name: 'Coğrafya-1', questions: 6 },
  { name: 'Coğrafya-2', questions: 5 },
  { name: 'Felsefe', questions: 10 },
  { name: 'Din', questions: 6 },
  { name: 'Matematik', questions: 30 },
  { name: 'Geometri', questions: 10 },
  { name: 'Fizik', questions: 14 },
  { name: 'Kimya', questions: 13 },
  { name: 'Biyoloji', questions: 13 }
];

const AYT_SUBJECTS_GENERAL = [
  { name: 'Türk Dili ve Edebiyatı', questions: 24 },
  { name: 'Sosyal Bilimler-1', questions: 20 },
  { name: 'Sosyal Bilimler-2', questions: 11 },
  { name: 'Matematik', questions: 40 },
  { name: 'Fen Bilimleri', questions: 40 }
];

interface PracticeTestsProps {
  user: { name: string; email: string };
}

export function PracticeTests({ user }: PracticeTestsProps) {
  const [activeTab, setActiveTab] = useState<'TYT' | 'AYT'>('TYT');
  const [tests, setTests] = useState<TestData[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [inputMode, setInputMode] = useState<'general' | 'detailed'>('general');
  const [subjectInputs, setSubjectInputs] = useState<Record<string, { correct: string; wrong: string }>>({});
  const [editingTest, setEditingTest] = useState<TestData | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('yks_tests');
    if (saved) {
      setTests(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('yks_tests', JSON.stringify(tests));
  }, [tests]);

  const calculateNet = (type: 'TYT' | 'AYT') => {
    const subjects = getSubjectList(type);
    let totalNet = 0;

    subjects.forEach(subject => {
      const input = subjectInputs[subject.name];
      if (input) {
        const correct = parseInt(input.correct) || 0;
        const wrong = parseInt(input.wrong) || 0;
        const net = correct - (wrong / 4);
        totalNet += net;
      }
    });

    return Math.max(0, parseFloat(totalNet.toFixed(2)));
  };

  const getSubjectList = (type: 'TYT' | 'AYT') => {
    if (type === 'TYT') {
      return inputMode === 'general' ? TYT_SUBJECTS_GENERAL : TYT_SUBJECTS_DETAILED;
    } else {
      return inputMode === 'general' ? AYT_SUBJECTS_GENERAL : AYT_SUBJECTS_DETAILED;
    }
  };

  const handleAddTest = () => {
    const net = calculateNet(activeTab);
    
    if (editingTest) {
      // Update existing test
      const updatedTest: TestData = {
        ...editingTest,
        tytNet: activeTab === 'TYT' ? net : editingTest.tytNet,
        aytNet: activeTab === 'AYT' ? net : editingTest.aytNet,
        subjects: subjectInputs
      };
      setTests(tests.map(t => t.id === editingTest.id ? updatedTest : t));
    } else {
      // Add new test
      const test: TestData = {
        id: Date.now(),
        name: `${activeTab} Deneme ${tests.filter(t => t.type === activeTab).length + 1}`,
        type: activeTab,
        date: new Date().toISOString().split('T')[0],
        tytNet: activeTab === 'TYT' ? net : 0,
        aytNet: activeTab === 'AYT' ? net : 0,
        subjects: subjectInputs
      };
      setTests([...tests, test]);
    }

    setSubjectInputs({});
    setEditingTest(null);
    setIsAddDialogOpen(false);
  };

  const handleEditTest = (test: TestData) => {
    setEditingTest(test);
    setActiveTab(test.type);
    if (test.subjects) {
      setSubjectInputs(test.subjects);
    }
    setIsAddDialogOpen(true);
  };

  const handleDeleteTest = (testId: number) => {
    setTests(tests.filter(t => t.id !== testId));
    setDeleteConfirmId(null);
  };

  const handleDialogClose = (open: boolean) => {
    setIsAddDialogOpen(open);
    if (!open) {
      setSubjectInputs({});
      setEditingTest(null);
    }
  };

  const filteredTests = tests.filter(test => test.type === activeTab);
  
  // Get target goals from profile
  const profile = useMemo(() => {
    const saved = localStorage.getItem('yks_profile');
    return saved ? JSON.parse(saved) : { tytGoal: '100', aytGoal: '50' };
  }, []);

  const targetGoal = activeTab === 'TYT' ? parseInt(profile.tytGoal) : parseInt(profile.aytGoal);

  const chartData = filteredTests.map((test) => ({
    name: new Date(test.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' }),
    net: activeTab === 'TYT' ? test.tytNet : test.aytNet,
    date: test.date,
    target: targetGoal
  }));

  const currentNet = calculateNet(activeTab);
  const subjects = getSubjectList(activeTab);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-slate-800 mb-2">Deneme Sınavları</h1>
        <p className="text-slate-600">Deneme sonuçlarınızı takip edin ve gelişiminizi izleyin</p>
      </div>

      {/* Tab Buttons */}
      <div className="flex bg-slate-100 p-1 rounded-xl w-fit mx-auto">
        <Button
          type="button"
          variant={activeTab === 'TYT' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('TYT')}
          className={`px-8 py-2 rounded-lg transition-all ${
            activeTab === 'TYT' 
              ? 'bg-blue-900 text-white shadow-md' 
              : 'text-slate-600 hover:text-slate-800'
          }`}
        >
          TYT
        </Button>
        <Button
          type="button"
          variant={activeTab === 'AYT' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('AYT')}
          className={`px-8 py-2 rounded-lg transition-all ${
            activeTab === 'AYT' 
              ? 'bg-blue-900 text-white shadow-md' 
              : 'text-slate-600 hover:text-slate-800'
          }`}
        >
          AYT
        </Button>
      </div>

      {/* Stats and Chart */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <TrendingUp className="w-5 h-5 text-blue-900" />
              <CardTitle className="text-lg">{activeTab} Gelişimi</CardTitle>
            </div>
            <Badge variant="secondary" className="bg-blue-100 text-blue-900">
              Son: {filteredTests.length > 0 ? (activeTab === 'TYT' ? filteredTests[filteredTests.length - 1]?.tytNet : filteredTests[filteredTests.length - 1]?.aytNet) : 0} net
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            {chartData.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[{ name: '', net: 0 }]}>
                    <XAxis dataKey="name" stroke="#cbd5e1" />
                    <YAxis stroke="#cbd5e1" />
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
                <div className="absolute text-slate-400 text-center">
                  <p>Henüz deneme eklenmedi</p>
                  <p className="text-sm">Deneme ekleyerek grafiği oluşturun</p>
                </div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <XAxis 
                    dataKey="name" 
                    stroke="#64748b" 
                    fontSize={12} 
                  />
                  <YAxis 
                    stroke="#64748b" 
                    fontSize={12} 
                  />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white p-3 rounded-lg shadow-lg border border-slate-200">
                            <p className="text-sm font-medium">{payload[0].payload.name}</p>
                            <p className="text-sm text-blue-900">Net: {payload[0].value}</p>
                            {targetGoal && <p className="text-sm text-orange-600">Hedef: {targetGoal}</p>}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="net" 
                    stroke={activeTab === 'TYT' ? '#1e3a8a' : '#1d4ed8'} 
                    strokeWidth={3}
                    dot={{ fill: activeTab === 'TYT' ? '#1e3a8a' : '#1d4ed8', r: 5 }}
                    name="Net"
                  />
                  {targetGoal && (
                    <Line 
                      type="monotone" 
                      dataKey="target" 
                      stroke="#f59e0b" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={{ fill: '#f59e0b', r: 4 }}
                      name="Hedef"
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Goals and Test List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Goals Card */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-1.5">
              <Target className="w-5 h-5 text-blue-900" />
              <CardTitle className="text-lg">Hedefler</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="text-slate-700 font-medium">TYT:</span>
              <Badge className="bg-blue-900 text-white">{profile.tytGoal} net</Badge>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-100 rounded-lg">
              <span className="text-slate-700 font-medium">AYT:</span>
              <Badge className="bg-blue-700 text-white">{profile.aytGoal} net</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Test List */}
        <div className="lg:col-span-2">
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-5 h-5 text-blue-900" />
                  <CardTitle className="text-lg">{activeTab} Denemeleri</CardTitle>
                </div>
                <Dialog open={isAddDialogOpen} onOpenChange={handleDialogClose}>
                  <DialogTrigger asChild>
                    <Button type="button" className="bg-blue-900 hover:bg-blue-800 text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      Deneme Ekle
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>
                        {editingTest ? `${activeTab} Denemesi Düzenle` : `${activeTab} Denemesi Ekle`}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      {/* Input Mode Toggle */}
                      <div className="flex bg-slate-100 p-1 rounded-xl">
                        <Button
                          type="button"
                          variant={inputMode === 'general' ? 'default' : 'ghost'}
                          onClick={() => {
                            setInputMode('general');
                            setSubjectInputs({});
                          }}
                          className={`flex-1 rounded-lg transition-all ${
                            inputMode === 'general' 
                              ? 'bg-blue-900 text-white shadow-md' 
                              : 'text-slate-600 hover:text-slate-800'
                          }`}
                        >
                          Genel
                        </Button>
                        <Button
                          type="button"
                          variant={inputMode === 'detailed' ? 'default' : 'ghost'}
                          onClick={() => {
                            setInputMode('detailed');
                            setSubjectInputs({});
                          }}
                          className={`flex-1 rounded-lg transition-all ${
                            inputMode === 'detailed' 
                              ? 'bg-blue-900 text-white shadow-md' 
                              : 'text-slate-600 hover:text-slate-800'
                          }`}
                        >
                          Ayrıntılı
                        </Button>
                      </div>

                      {/* Subject Inputs */}
                      {subjects.map(subject => (
                        <div key={subject.name} className="space-y-2 p-4 bg-slate-50 rounded-lg">
                          <Label className="font-semibold">{subject.name} ({subject.questions} soru)</Label>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label htmlFor={`${subject.name}-correct`} className="text-xs">Doğru</Label>
                              <Input
                                id={`${subject.name}-correct`}
                                type="number"
                                inputMode="numeric"
                                min="0"
                                max={subject.questions}
                                value={subjectInputs[subject.name]?.correct || ''}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  const numValue = parseInt(value) || 0;
                                  const wrongValue = parseInt(subjectInputs[subject.name]?.wrong) || 0;
                                  
                                  // Validate that correct + wrong doesn't exceed max questions
                                  if (numValue + wrongValue <= subject.questions || value === '') {
                                    setSubjectInputs(prev => ({
                                      ...prev,
                                      [subject.name]: { ...prev[subject.name], correct: value }
                                    }));
                                  }
                                }}
                                placeholder="Doğru"
                              />
                            </div>
                            <div>
                              <Label htmlFor={`${subject.name}-wrong`} className="text-xs">Yanlış</Label>
                              <Input
                                id={`${subject.name}-wrong`}
                                type="number"
                                inputMode="numeric"
                                min="0"
                                value={subjectInputs[subject.name]?.wrong || ''}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  const numValue = parseInt(value) || 0;
                                  const correctValue = parseInt(subjectInputs[subject.name]?.correct) || 0;
                                  
                                  // Validate that correct + wrong doesn't exceed max questions
                                  if (correctValue + numValue <= subject.questions || value === '') {
                                    setSubjectInputs(prev => ({
                                      ...prev,
                                      [subject.name]: { ...prev[subject.name], wrong: value }
                                    }));
                                  }
                                }}
                                placeholder="Yanlış"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm text-slate-600">Hesaplanan Net:</p>
                        <p className="text-2xl font-semibold text-blue-900">{currentNet}</p>
                      </div>

                      <Button type="button" onClick={handleAddTest} className="w-full bg-blue-900 hover:bg-blue-800">
                        {editingTest ? 'Güncelle' : 'Deneme Kaydet'}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredTests.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Henüz {activeTab} denemesi bulunmuyor.</p>
                  </div>
                ) : (
                  filteredTests.map((test) => (
                    <div key={test.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                      <div className="flex-1">
                        <h4 className="font-medium text-slate-800">{test.name}</h4>
                        <p className="text-sm text-slate-600">
                          {new Date(test.date).toLocaleDateString('tr-TR', { 
                            day: 'numeric', 
                            month: 'long', 
                            year: 'numeric' 
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-xl font-semibold text-blue-900">
                            {activeTab === 'TYT' ? test.tytNet : test.aytNet} net
                          </div>
                        </div>
                        <div className="flex gap-1.5">
                        <Dialog open={deleteConfirmId === test.id} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
                            <DialogTrigger asChild>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => setDeleteConfirmId(test.id)}
                                className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-100"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Denemeyi Sil</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <p className="text-slate-600">
                                  <strong>{test.name}</strong> denemesini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                                </p>
                                <div className="flex gap-3 justify-end">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setDeleteConfirmId(null)}
                                  >
                                    İptal
                                  </Button>
                                  <Button
                                    type="button"
                                    className="bg-red-600 hover:bg-red-700 text-white"
                                    onClick={() => handleDeleteTest(test.id)}
                                  >
                                    Sil
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}