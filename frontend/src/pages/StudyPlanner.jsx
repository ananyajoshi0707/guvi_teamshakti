import { useState, useEffect } from 'react';
import 'react-calendar/dist/Calendar.css';

export default function SmartStudyPlanner() {
  const [subjects, setSubjects] = useState([
    { subject: '', chapters: [''], examDate: '' }
  ]);
  const [dailyAvailability, setDailyAvailability] = useState('');
  const [plans, setPlans] = useState([]);
  const [timetable, setTimetable] = useState([]);

  useEffect(() => {
    if (plans.length > 0 && dailyAvailability) {
      setTimetable(generateTimetable());
    } else {
      setTimetable([]);
    }
  }, [plans, dailyAvailability]);

  const handleSubjectChange = (index, field, value) => {
    const updatedSubjects = [...subjects];
    updatedSubjects[index][field] = value;
    setSubjects(updatedSubjects);
  };

  const handleChapterChange = (subIndex, chapIndex, value) => {
    const updatedSubjects = [...subjects];
    updatedSubjects[subIndex].chapters[chapIndex] = value;
    setSubjects(updatedSubjects);
  };

  const addChapterField = (subIndex) => {
    const updatedSubjects = [...subjects];
    updatedSubjects[subIndex].chapters.push('');
    setSubjects(updatedSubjects);
  };

  const removeChapterField = (subIndex, chapIndex) => {
    const updatedSubjects = [...subjects];
    updatedSubjects[subIndex].chapters.splice(chapIndex, 1);
    setSubjects(updatedSubjects);
  };

  const addSubjectField = () => {
    setSubjects([
      ...subjects,
      { subject: '', chapters: [''], examDate: '' }
    ]);
  };

  const removeSubjectField = (index) => {
    const updatedSubjects = subjects.filter((_, i) => i !== index);
    setSubjects(updatedSubjects);
  };

  const generateTimetable = () => {
    const toMidnight = (date) => {
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      return d;
    };
  
    const today = toMidnight(new Date());
    const dailyHoursAvailable = Number(dailyAvailability) || 0;
  
    const subjectsWithData = plans.map(plan => {
      const examDate = toMidnight(new Date(plan.examDate));
      const daysUntilExam = Math.ceil((examDate - today) / (1000 * 60 * 60 * 24));
      return {
        ...plan,
        examDate,
        daysUntilExam
      };
    }).filter(subject => subject.daysUntilExam > 0);
  
    if (subjectsWithData.length === 0) return [];
  
    const maxDays = Math.max(...subjectsWithData.map(s => {
      const days = Math.ceil((s.examDate - today) / (1000 * 60 * 60 * 24));
      return days - 1;
    }));
  
    const timetable = [];
  
    for (let i = 0; i <= maxDays; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const currentDate = toMidnight(date);
  
      let remainingHours = dailyHoursAvailable;
      const daySubjects = [];
  
      const activeSubjects = subjectsWithData
        .filter(subject => subject.examDate.getTime() > currentDate.getTime())
        .sort((a, b) => a.examDate - b.examDate);
  
      if (activeSubjects.length > 0) {
        const totalChapters = activeSubjects.reduce(
          (sum, subj) => sum + subj.chapters.length, 0
        );
        if (totalChapters === 0) continue;
  
        let hoursPerChapter = Math.floor(dailyHoursAvailable / totalChapters);
        let leftover = dailyHoursAvailable - (hoursPerChapter * totalChapters);
  
        for (let subj of activeSubjects) {
          for (let chap of subj.chapters) {
            let hours = hoursPerChapter;
            if (leftover > 0) {
              hours += 1;
              leftover--;
            }
  
            if (hours > 0) {
              daySubjects.push({
                subject: subj.subject,
                chapter: chap,
                hours,
                examIn: `${Math.max(0, subj.daysUntilExam - i)} days`
              });
            }
          }
        }
      }
  
      timetable.push({
        date: currentDate.toDateString(),
        subjects: daySubjects,
        remainingHours: 0
      });
    }
  
    return timetable;
  };
  

  const handleSubmit = (e) => {
    e.preventDefault();
    const validPlans = subjects.filter(
      s => s.subject.trim() && s.chapters.some(c => c.trim()) && s.examDate
    );
    if (validPlans.length === 0) {
      alert("Please fill in at least one valid subject.");
      return;
    }
    setPlans([...plans, ...validPlans]);
  };

  const clearForm = () => {
    setSubjects([{ subject: '', chapters: [''], examDate: '' }]);
    setPlans([]);
    setTimetable([]);
    setDailyAvailability('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-center text-white">
          <h1 className="text-4xl font-bold mb-2">📚 Personalized Study Planner</h1>
          <p className="text-lg opacity-90">Organize your study sessions and ace your exams with ease!😎</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
          <div className="lg:col-span-1 bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Don't worry, just enter the required and let us do the rest!😉
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {subjects.map((entry, index) => (
                <div key={index} className="space-y-2 border p-3 rounded-xl bg-gray-100 relative">
                  {subjects.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSubjectField(index)}
                      className="absolute top-2 right-2 text-red-600 text-sm"
                    >
                      ❌ Remove
                    </button>
                  )}
                  <input
                    type="text"
                    value={entry.subject}
                    onChange={(e) => handleSubjectChange(index, 'subject', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Subject (required)"
                    required
                  />
                  {entry.chapters.map((chap, chapIdx) => (
                    <div key={chapIdx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={chap}
                        onChange={(e) => handleChapterChange(index, chapIdx, e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg"
                        placeholder={`Chapter ${chapIdx + 1}`}
                        required
                      />
                      {entry.chapters.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeChapterField(index, chapIdx)}
                          className="text-red-500 text-sm"
                        >
                          ❌
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addChapterField(index)}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    ➕ Add Chapter
                  </button>

                  <input
                    type="date"
                    value={entry.examDate}
                    onChange={(e) => handleSubjectChange(index, 'examDate', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>
              ))}

              <button
                type="button"
                onClick={addSubjectField}
                className="text-blue-600 font-medium hover:underline"
              >
                ➕ Add Another Subject
              </button>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Daily Study Availability (hrs)
                </label>
                <input
                  type="number"
                  min="1"
                  value={dailyAvailability}
                  onChange={(e) => setDailyAvailability(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  required
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg"
                >
                  Generate Timetable
                </button>
                <button
                  type="button"
                  onClick={clearForm}
                  className="w-full bg-gray-300 hover:bg-gray-400 text-black font-medium py-3 px-4 rounded-lg"
                >
                  Clear Form
                </button>
              </div>
            </form>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">Your Smart Timetable</h2>
              {timetable.length > 0 ? (
                <div className="space-y-4">
                  {timetable.map((day, index) => (
                    <div key={index} className="border-b border-gray-200 pb-4 last:border-0">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium text-lg text-blue-600">{day.date}</h3>
                      </div>
                      <div className="space-y-2">
                        {day.subjects.length > 0 ? (
                          day.subjects.map((subject, i) => (
                            <div
                              key={i}
                              className="flex justify-between items-center bg-blue-50 p-3 rounded-lg"
                            >
                              <div>
                                <h4 className="font-medium">{subject.subject}</h4>
                                <p className="text-sm text-gray-600">
                                  {subject.chapter} • Exam in {subject.examIn}
                                </p>
                              </div>
                              <span className="bg-blue-100 text-blue-800 py-1 px-3 rounded-full text-sm font-medium">
                                {subject.hours}h
                              </span>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-500 text-center py-4">
                            No study sessions scheduled
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">
                    Add your subjects to generate a smart timetable
                  </p>
                  <svg
                    className="w-16 h-16 mx-auto text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    ></path>
                  </svg>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}




