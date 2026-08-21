import React, { useState } from 'react';
import { 
  BookOpen, 
  GraduationCap, 
  CheckCircle2, 
  PlayCircle, 
  Clock, 
  Award, 
  DollarSign, 
  FileText, 
  Check, 
  Lock, 
  Sparkles,
  ChevronRight,
  User,
  Star,
  Download
} from 'lucide-react';
import { LMSCourse, StudentEnrollment, UserProfile } from '../../types';
import { StorageManager } from '../../utils/storage';

interface StudentLMSViewProps {
  currentUser: UserProfile | null;
  onOpenAuth: (mode?: 'signin' | 'signup') => void;
}

export const StudentLMSView: React.FC<StudentLMSViewProps> = ({ currentUser, onOpenAuth }) => {
  const [courses, setCourses] = useState<LMSCourse[]>(() => StorageManager.getLMSCourses());
  const [enrollments, setEnrollments] = useState<StudentEnrollment[]>(() => StorageManager.getStudentEnrollments());
  const [activeTab, setActiveTab] = useState<'catalog' | 'my-courses' | 'ledger'>('catalog');
  const [selectedCourse, setSelectedCourse] = useState<LMSCourse | null>(null);
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);

  const studentEnrollments = currentUser 
    ? enrollments.filter(e => e.studentId === currentUser.id)
    : enrollments.filter(e => e.studentId === 'usr-demo');

  const handleEnroll = (course: LMSCourse) => {
    if (!currentUser) {
      alert('Please sign in or create an account to enroll in courses.');
      onOpenAuth('signin');
      return;
    }
    const studentUser = currentUser;
    const newEnr = StorageManager.enrollStudent(studentUser, course);
    setEnrollments(StorageManager.getStudentEnrollments());
    setSelectedCourse(course);
    setActiveTab('my-courses');
    alert(`🎉 Successfully enrolled in "${course.title}"! Welcome to your art learning journey.`);
  };

  return (
    <div className="bg-[#fcfbf9] min-h-screen py-8 text-stone-900 selection:bg-blue-600 selection:text-white">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Banner */}
        <div className="relative rounded-3xl bg-gradient-to-r from-stone-900 via-slate-900 to-indigo-950 text-white p-8 sm:p-12 overflow-hidden shadow-xl">
          <div className="absolute right-0 bottom-0 opacity-15 translate-x-12 translate-y-12">
            <GraduationCap className="w-96 h-96 text-white" />
          </div>
          
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 bg-blue-600/30 border border-blue-400/30 text-blue-300 text-xs font-semibold px-3.5 py-1.5 rounded-full backdrop-blur-md">
              <Sparkles className="w-4 h-4" />
              <span>NAVI ARTIST ACADEMY • LMS & Student Portal</span>
            </div>
            
            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight leading-tight">
              Master Fine Art With Master Ateliers
            </h1>
            
            <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
              Explore professional masterclasses in charcoal portraiture, oil painting, and watercolor. Track your progress, watch video lessons, and manage your tuition ledger seamlessly.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setActiveTab('catalog')}
                className={`px-5 py-3 rounded-xl text-xs font-bold transition-all shadow-xs ${
                  activeTab === 'catalog'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                📚 Explore Courses ({courses.length})
              </button>
              
              <button
                onClick={() => {
                  if (!currentUser) { onOpenAuth('signin'); return; }
                  setActiveTab('my-courses');
                }}
                className={`px-5 py-3 rounded-xl text-xs font-bold transition-all shadow-xs ${
                  activeTab === 'my-courses'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                🎓 My Enrolled Courses ({studentEnrollments.length})
              </button>

              <button
                onClick={() => {
                  if (!currentUser) { onOpenAuth('signin'); return; }
                  setActiveTab('ledger');
                }}
                className={`px-5 py-3 rounded-xl text-xs font-bold transition-all shadow-xs ${
                  activeTab === 'ledger'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                💳 Fee Ledger & Invoices
              </button>
            </div>
          </div>
        </div>

        {/* TAB 1: COURSE CATALOG */}
        {activeTab === 'catalog' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-2xl font-bold text-slate-900">Available Art Masterclasses</h2>
                <p className="text-xs text-slate-500 mt-1">Select a course to view syllabus, lessons, and instant enrollment.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => {
                const isEnrolled = studentEnrollments.some(e => e.courseId === course.id);
                return (
                  <div key={course.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl transition-all flex flex-col group">
                    <div className="relative h-52 overflow-hidden bg-slate-900">
                      <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-3 left-3 bg-stone-900/80 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        {course.category}
                      </div>
                      <div className="absolute top-3 right-3 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                        ₹{course.price.toLocaleString('en-IN')}
                      </div>
                    </div>

                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-[11px] text-slate-500">
                          <span className="flex items-center gap-1 font-medium"><Clock className="w-3.5 h-3.5 text-blue-600" /> {course.duration}</span>
                          <span className="bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded-md">{course.level}</span>
                        </div>

                        <h3 className="font-serif text-lg font-bold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors">
                          {course.title}
                        </h3>

                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {course.description}
                        </p>

                        <p className="text-[11px] font-semibold text-slate-500 pt-1">
                          Instructor: <span className="text-slate-800">{course.instructor}</span>
                        </p>
                      </div>

                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700">{course.lessons.length} Video Lessons</span>
                        {isEnrolled ? (
                          <button
                            onClick={() => {
                              setSelectedCourse(course);
                              setActiveTab('my-courses');
                            }}
                            className="px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Access Course</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleEnroll(course)}
                            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                          >
                            <span>Enroll Now</span>
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: MY ENROLLED COURSES & LESSON PLAYER */}
        {activeTab === 'my-courses' && (
          <div className="space-y-6 animate-fadeIn">
            {studentEnrollments.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto">
                  <BookOpen className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-xl font-bold text-slate-900">No Enrolled Courses Yet</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  You haven't enrolled in any art masterclasses yet. Explore our course catalog to start learning from master ateliers.
                </p>
                <button
                  onClick={() => setActiveTab('catalog')}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs"
                >
                  Browse Course Catalog
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Enrolled Courses Sidebar */}
                <div className="space-y-4">
                  <h3 className="font-serif text-lg font-bold text-slate-900">My Learning Dashboard</h3>
                  <div className="space-y-3">
                    {studentEnrollments.map((enr) => {
                      const courseObj = courses.find(c => c.id === enr.courseId) || courses[0];
                      const isSelected = selectedCourse?.id === enr.courseId;
                      return (
                        <div
                          key={enr.id}
                          onClick={() => {
                            setSelectedCourse(courseObj);
                            setActiveLessonIndex(0);
                          }}
                          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-blue-50/80 border-blue-300 shadow-sm'
                              : 'bg-white border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <img src={courseObj.image} alt={courseObj.title} className="w-14 h-14 rounded-xl object-cover" />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-serif font-bold text-slate-900 text-sm truncate">{enr.courseTitle}</h4>
                              <p className="text-[11px] text-slate-500">Instructor: {courseObj.instructor}</p>
                              
                              <div className="flex items-center gap-2 mt-2">
                                <div className="flex-1 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                                  <div className="bg-blue-600 h-full rounded-full" style={{ width: `${enr.progressPercent}%` }} />
                                </div>
                                <span className="text-[10px] font-bold text-slate-600">{enr.progressPercent}%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Lesson Player & Syllabus Main View */}
                <div className="lg:col-span-2 space-y-6">
                  {(() => {
                    const activeCourse = selectedCourse || courses.find(c => c.id === studentEnrollments[0]?.courseId) || courses[0];
                    const currentLesson = activeCourse?.lessons[activeLessonIndex] || activeCourse?.lessons[0];

                    return (
                      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
                        
                        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                          <div>
                            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">{activeCourse.category}</span>
                            <h2 className="font-serif text-2xl font-bold text-slate-900">{activeCourse.title}</h2>
                          </div>
                          <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200">
                            Enrolled & Active
                          </span>
                        </div>

                        {/* Video Player Simulation Box */}
                        <div className="space-y-3">
                          <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900 flex items-center justify-center shadow-lg group">
                            <img src={activeCourse.image} alt={activeCourse.title} className="w-full h-full object-cover opacity-60" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-between p-6">
                              <div className="flex items-center justify-between text-white text-xs font-mono">
                                <span>Lesson {activeLessonIndex + 1} of {activeCourse.lessons.length}</span>
                                <span className="bg-blue-600 px-2.5 py-1 rounded-md font-sans font-bold">{currentLesson?.duration}</span>
                              </div>

                              <div className="text-center space-y-3">
                                <button
                                  onClick={() => alert(`▶️ Playing video lesson: "${currentLesson?.title}"`)}
                                  className="w-16 h-16 bg-blue-600 hover:bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto shadow-xl group-hover:scale-110 transition-transform"
                                >
                                  <PlayCircle className="w-10 h-10 ml-0.5" />
                                </button>
                                <h3 className="font-serif text-xl font-bold text-white">{currentLesson?.title}</h3>
                              </div>

                              <div className="text-[11px] text-stone-300 text-center">
                                Master Atelier Video Stream • HD 1080p
                              </div>
                            </div>
                          </div>

                          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                            <div>
                              <p className="font-bold text-slate-800">Lesson Description:</p>
                              <p className="text-slate-600 mt-0.5">{currentLesson?.description || 'Follow along with the master instructor.'}</p>
                            </div>
                            <button
                              onClick={() => alert('📥 Downloading lesson reference PDF & homework guide...')}
                              className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl font-bold text-slate-700 flex items-center gap-1.5 shadow-xs"
                            >
                              <Download className="w-4 h-4 text-blue-600" />
                              <span>Resources PDF</span>
                            </button>
                          </div>
                        </div>

                        {/* Course Curriculum / Lessons List */}
                        <div className="space-y-3 pt-2">
                          <h4 className="font-serif font-bold text-slate-900 text-base">Course Syllabus & Lessons</h4>
                          <div className="space-y-2">
                            {activeCourse.lessons.map((lesson, idx) => {
                              const isCurrent = activeLessonIndex === idx;
                              return (
                                <div
                                  key={lesson.id}
                                  onClick={() => setActiveLessonIndex(idx)}
                                  className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                                    isCurrent
                                      ? 'bg-blue-50 border-blue-300 text-blue-900'
                                      : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-800'
                                  }`}
                                >
                                  <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                                      isCurrent ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                                    }`}>
                                      {idx + 1}
                                    </div>
                                    <div>
                                      <p className="font-bold text-xs sm:text-sm">{lesson.title}</p>
                                      <p className="text-[11px] text-slate-500">{lesson.duration}</p>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-semibold text-slate-500">{lesson.duration}</span>
                                    <PlayCircle className={`w-5 h-5 ${isCurrent ? 'text-blue-600' : 'text-slate-400'}`} />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                      </div>
                    );
                  })()}
                </div>

              </div>
            )}
          </div>
        )}

        {/* TAB 3: FEE LEDGER & INVOICES */}
        {activeTab === 'ledger' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-2xl font-bold text-slate-900">Student Fee Ledger & Invoices</h2>
                <p className="text-xs text-slate-500 mt-1">Review your tuition fee statements, debits, credits, and payment clearances.</p>
              </div>
            </div>

            <div className="space-y-6">
              {studentEnrollments.map((enr) => (
                <div key={enr.id} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                    <div>
                      <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Enrollment #{enr.id}</span>
                      <h3 className="font-serif text-xl font-bold text-slate-900">{enr.courseTitle}</h3>
                      <p className="text-xs text-slate-500">Student: {enr.studentName} ({enr.studentEmail})</p>
                    </div>

                    <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Total Fee</span>
                        <span className="font-serif font-bold text-slate-900 text-sm">₹{enr.feeTotal.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="w-px h-8 bg-slate-300" />
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Paid</span>
                        <span className="font-serif font-bold text-emerald-600 text-sm">₹{enr.feePaid.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="w-px h-8 bg-slate-300" />
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Status</span>
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                          enr.feeStatus === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {enr.feeStatus}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Ledger Table */}
                  <div className="space-y-3">
                    <h4 className="font-serif font-bold text-slate-900 text-sm">Transaction Ledger Statement</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                            <th className="p-3.5 rounded-l-xl">Date</th>
                            <th className="p-3.5">Description</th>
                            <th className="p-3.5 text-right">Debit (₹)</th>
                            <th className="p-3.5 text-right">Credit (₹)</th>
                            <th className="p-3.5 text-right rounded-r-xl">Balance Due (₹)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {enr.ledger.map((entry) => (
                            <tr key={entry.id} className="hover:bg-slate-50">
                              <td className="p-3.5 font-mono text-slate-600">{entry.date}</td>
                              <td className="p-3.5 font-medium text-slate-800">{entry.description}</td>
                              <td className="p-3.5 text-right font-mono text-slate-700">
                                {entry.debit > 0 ? `₹${entry.debit.toLocaleString('en-IN')}` : '-'}
                              </td>
                              <td className="p-3.5 text-right font-mono text-emerald-600 font-bold">
                                {entry.credit > 0 ? `₹${entry.credit.toLocaleString('en-IN')}` : '-'}
                              </td>
                              <td className="p-3.5 text-right font-mono font-bold text-slate-900">
                                ₹{entry.balance.toLocaleString('en-IN')}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
