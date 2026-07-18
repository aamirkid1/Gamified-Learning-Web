"use client";


export default function CourseHero({ course }) {
  if (!course) return null;

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#4b1d12] via-[#6b1f0f] to-[#8b4513] text-white shadow-2xl">

      <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute left-0 bottom-0 h-48 w-48 rounded-full bg-white/5 blur-3xl" />

      <div className="relative grid md:grid-cols-2 gap-10 items-center p-10">

        {/* LEFT SIDE */}

        <div className="space-y-6">

          <div className="inline-flex items-center rounded-full bg-white/15 px-4 py-1 text-sm font-semibold backdrop-blur">
            University Course
          </div>

          <h1 className="text-5xl font-black leading-tight">
            {course.title}
          </h1>

          <p className="text-lg text-gray-200 leading-relaxed">
            {course.description}
          </p>

          <div className="flex flex-wrap gap-3 pt-2">

            <div className="rounded-xl bg-white/15 px-4 py-3 backdrop-blur">
              <p className="text-xs uppercase text-gray-200">
                Lessons
              </p>

              <h3 className="text-xl font-bold">
                {course.lessonCount ?? 0}
              </h3>
            </div>

            <div className="rounded-xl bg-white/15 px-4 py-3 backdrop-blur">
              <p className="text-xs uppercase text-gray-200">
                Quizzes
              </p>

              <h3 className="text-xl font-bold">
                {course.quizCount ?? 0}
              </h3>
            </div>

            <div className="rounded-xl bg-white/15 px-4 py-3 backdrop-blur">
              <p className="text-xs uppercase text-gray-200">
                Difficulty
              </p>

              <h3 className="text-xl font-bold">
                Beginner
              </h3>
            </div>

          </div>

        </div>

        {/* RIGHT SIDE */}

        <div className="flex justify-center">

          {course.thumbnail ? (
            <div className="overflow-hidden rounded-3xl border-4 border-white shadow-2xl">

              <img
    src={course.thumbnail}
    alt={course.title}
    className="w-full h-[330px] object-cover rounded-3xl"
/>

            </div>
          ) : (
            <div className="flex h-[320px] w-full max-w-md items-center justify-center rounded-3xl border-4 border-dashed border-white/40 bg-white/10 text-center text-lg font-semibold">
              No Thumbnail
            </div>
          )}

        </div>

      </div>

    </section>
  );
}