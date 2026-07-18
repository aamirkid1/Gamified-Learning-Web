"use client";

export default function EnrollmentCard({
  isEnrolled,
  handleEnroll,
  lessons,
  quizzes,
}) {
  return (
    <section className="bg-gradient-to-r from-[#4b1d12] via-[#6b1f0f] to-[#8b4513] rounded-3xl text-white p-10 shadow-2xl">

      <h2 className="text-3xl font-black">
        Ready to Start Learning?
      </h2>

      <p className="mt-3 text-gray-200">
        Enroll now and unlock the complete learning experience.
      </p>

      <div className="grid md:grid-cols-3 gap-5 mt-8">

        <div className="bg-white/10 rounded-xl p-4 backdrop-blur">
          <h3 className="text-2xl font-black">
            {lessons.length}
          </h3>

          <p>Lessons</p>
        </div>

        <div className="bg-white/10 rounded-xl p-4 backdrop-blur">
          <h3 className="text-2xl font-black">
            {quizzes.length}
          </h3>

          <p>Quizzes</p>
        </div>

        <div className="bg-white/10 rounded-xl p-4 backdrop-blur">
          <h3 className="text-2xl font-black">
            XP
          </h3>

          <p>Rewards</p>
        </div>

      </div>

      {!isEnrolled ? (
        <button
          onClick={handleEnroll}
          className="mt-8 bg-white text-[#6b1f0f] font-bold px-8 py-4 rounded-xl hover:scale-105 transition"
        >
          Enroll Now
        </button>
      ) : (
        <div className="mt-8 bg-green-600 rounded-xl px-6 py-4 font-bold">
          ✓ You are enrolled
        </div>
      )}

    </section>
  );
}