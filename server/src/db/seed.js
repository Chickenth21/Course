import { supabase } from '../config/supabase.js';
import { placementTestData, sampleCoursesData } from './seedData.js';

export async function seedDatabase() {
  if (!supabase) {
    console.error('❌ Cannot seed database: Supabase client is not initialized.');
    return;
  }

  console.log('🌱 Starting database seed process...');

  try {
    // 1. Seed Placement Test
    const { data: existingTest } = await supabase
      .from('assessments')
      .select('id')
      .eq('title', placementTestData.title)
      .single();

    let assessmentId = existingTest?.id;

    if (!assessmentId) {
      const { data: test, error: testError } = await supabase
        .from('assessments')
        .insert([{
          title: placementTestData.title,
          description: placementTestData.description,
          target_level: placementTestData.target_level,
          duration_minutes: placementTestData.duration_minutes,
          is_active: true
        }])
        .select()
        .single();

      if (testError) {
        console.warn('⚠️ Could not insert assessment (table may need to be created first):', testError.message);
        return;
      }
      assessmentId = test.id;
      console.log(`✅ Seeded Assessment: "${test.title}"`);

      // Seed Questions
      const questionsToInsert = placementTestData.questions.map((q) => ({
        ...q,
        assessment_id: assessmentId
      }));

      const { error: qError } = await supabase
        .from('assessment_questions')
        .insert(questionsToInsert);

      if (qError) {
        console.error('❌ Error inserting questions:', qError.message);
      } else {
        console.log(`✅ Seeded ${questionsToInsert.length} Assessment Questions.`);
      }
    } else {
      console.log('ℹ️ Placement Test already exists.');
    }

    // 2. Seed Sample Courses
    for (const courseData of sampleCoursesData) {
      const { data: existingCourse } = await supabase
        .from('courses')
        .select('id')
        .eq('title', courseData.title)
        .single();

      if (!existingCourse) {
        const { data: course, error: cError } = await supabase
          .from('courses')
          .insert([{
            title: courseData.title,
            description: courseData.description,
            level: courseData.level,
            order_index: courseData.order_index
          }])
          .select()
          .single();

        if (cError) {
          console.warn('⚠️ Course insert error:', cError.message);
          continue;
        }

        console.log(`✅ Seeded Course: "${course.title}"`);

        // Seed Modules
        for (const modData of courseData.modules) {
          const { data: module, error: mError } = await supabase
            .from('modules')
            .insert([{
              course_id: course.id,
              title: modData.title,
              description: modData.description,
              order_index: modData.order_index
            }])
            .select()
            .single();

          if (mError) continue;

          // Seed Lessons & Exercises
          for (const lessonData of modData.lessons) {
            const { data: lesson, error: lError } = await supabase
              .from('lessons')
              .insert([{
                module_id: module.id,
                title: lessonData.title,
                description: lessonData.description,
                objectives: lessonData.objectives,
                content: lessonData.content,
                level: lessonData.level,
                duration_minutes: lessonData.duration_minutes,
                order_index: lessonData.order_index
              }])
              .select()
              .single();

            if (lError) continue;

            if (lessonData.exercises?.length) {
              const exercisesToInsert = lessonData.exercises.map((ex) => ({
                ...ex,
                lesson_id: lesson.id
              }));
              await supabase.from('exercises').insert(exercisesToInsert);
            }
          }
        }
      }
    }

    console.log('✨ Seed complete!');
  } catch (error) {
    console.error('❌ Seed error:', error.message);
  }
}

// Run directly if invoked via node CLI
if (process.argv[1]?.endsWith('seed.js')) {
  seedDatabase().then(() => process.exit(0));
}
