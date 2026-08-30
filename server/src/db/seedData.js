export const placementTestData = {
  title: 'Bài Đánh Giá Trình Độ Tiếng Anh Toàn Diện (CEFR Placement Test)',
  description: 'Đánh giá năng lực tiếng Anh tổng quát từ A1 đến B2 qua các kỹ năng Ngữ pháp, Từ vựng và Đọc hiểu để sinh lộ trình học phù hợp.',
  target_level: 'ALL',
  duration_minutes: 25,
  is_active: true,
  questions: [
    // Grammar A1
    {
      skill: 'Grammar',
      difficulty: 'A1',
      question: 'She _____ to school by bus every morning.',
      options: ['go', 'goes', 'going', 'is go'],
      correct_answer: 'goes',
      explanation: 'Với chủ ngữ ngôi thứ 3 số ít "She", động từ ở thì hiện tại đơn thêm "-es" (goes).',
      order_index: 1
    },
    // Vocabulary A1
    {
      skill: 'Vocabulary',
      difficulty: 'A1',
      question: 'What is the opposite of "expensive"?',
      options: ['Cheap', 'Heavy', 'Fast', 'Difficult'],
      correct_answer: 'Cheap',
      explanation: '"Expensive" (đắt) trái nghĩa với "Cheap" (rẻ).',
      order_index: 2
    },
    // Grammar A2
    {
      skill: 'Grammar',
      difficulty: 'A2',
      question: 'Yesterday, we _____ a great movie at the cinema.',
      options: ['watch', 'watched', 'watching', 'have watched'],
      correct_answer: 'watched',
      explanation: 'Dấu hiệu thời gian "Yesterday" (hôm qua) chỉ hành động đã hoàn tất trong quá khứ -> dùng Quá khứ đơn (watched).',
      order_index: 3
    },
    // Vocabulary A2
    {
      skill: 'Vocabulary',
      difficulty: 'A2',
      question: 'She is interested _____ learning new foreign languages.',
      options: ['at', 'in', 'on', 'with'],
      correct_answer: 'in',
      explanation: 'Cụm từ cố định: "to be interested in something" (thích thú, quan tâm đến điều gì).',
      order_index: 4
    },
    // Reading A2
    {
      skill: 'Reading',
      difficulty: 'A2',
      question: 'Read: "Mark wakes up at 6 AM, drinks a cup of coffee, and walks his dog before going to the office." What does Mark do first?',
      options: ['Goes to the office', 'Drinks coffee', 'Wakes up', 'Walks his dog'],
      correct_answer: 'Wakes up',
      explanation: 'Hành động đầu tiên trong chuỗi thói quen buổi sáng là thức dậy (wakes up at 6 AM).',
      order_index: 5
    },
    // Grammar B1
    {
      skill: 'Grammar',
      difficulty: 'B1',
      question: 'If it rains tomorrow, we _____ the picnic.',
      options: ['cancel', 'would cancel', 'will cancel', 'have cancelled'],
      correct_answer: 'will cancel',
      explanation: 'Câu điều kiện loại 1 (sự việc có thể xảy ra ở hiện tại/tương lai): If + S + V(hiện tại đơn), S + will + V-nguyên thể.',
      order_index: 6
    },
    // Vocabulary B1
    {
      skill: 'Vocabulary',
      difficulty: 'B1',
      question: 'The meeting was _____ until next Monday due to bad weather.',
      options: ['put off', 'put on', 'put out', 'put up'],
      correct_answer: 'put off',
      explanation: 'Phrasal verb "put off" = hoãn lại (postpone).',
      order_index: 7
    },
    // Reading B1
    {
      skill: 'Reading',
      difficulty: 'B1',
      question: 'Read: "Despite the heavy traffic, John managed to arrive at the airport just in time for his flight." Did John miss his flight?',
      options: ['Yes, he missed it', 'No, he caught it in time', 'He cancelled his flight', 'He arrived 3 hours late'],
      correct_answer: 'No, he caught it in time',
      explanation: '"Just in time" nghĩa là kịp giờ, không bị lỡ chuyến bay.',
      order_index: 8
    },
    // Grammar B2
    {
      skill: 'Grammar',
      difficulty: 'B2',
      question: 'By this time next year, Sarah _____ from university.',
      options: ['will graduate', 'will have graduated', 'has graduated', 'graduates'],
      correct_answer: 'will have graduated',
      explanation: '"By this time next year" chỉ thời điểm tương lai -> dùng thì Tương lai hoàn thành (Future Perfect: will have + V3/ed).',
      order_index: 9
    },
    // Vocabulary B2
    {
      skill: 'Vocabulary',
      difficulty: 'B2',
      question: 'The company is seeking a candidate with exceptional _____ skills to lead the new project.',
      options: ['reluctant', 'interpersonal', 'obsolete', 'superficial'],
      correct_answer: 'interpersonal',
      explanation: '"Interpersonal skills" = kỹ năng giao tiếp và làm việc giữa các cá nhân.',
      order_index: 10
    }
  ]
};

export const sampleCoursesData = [
  {
    title: 'English Foundations A1 (Cơ Bản Cho Người Mới Bắt Đầu)',
    description: 'Nắm vững các mẫu câu giao tiếp cơ bản, từ vựng đời sống hàng ngày và ngữ pháp nền tảng.',
    level: 'A1',
    order_index: 1,
    modules: [
      {
        title: 'Module 1: Daily Life & Routines',
        description: 'Các chủ đề quen thuộc xoay quanh hoạt động hàng ngày.',
        order_index: 1,
        lessons: [
          {
            title: 'Thì Hiện Tại Đơn (Present Simple Tense)',
            description: 'Cách dùng, cấu trúc và quy tắc chia động từ cho thói quen hàng ngày.',
            level: 'A1',
            duration_minutes: 15,
            order_index: 1,
            objectives: [
              'Hiểu rõ khi nào dùng thì hiện tại đơn',
              'Chia đúng động từ ngôi thứ 3 số ít (he/she/it)',
              'Đặt câu hỏi và câu phủ định với Do/Does'
            ],
            content: {
              explanation: 'Thì hiện tại đơn dùng để diễn tả chân lý, sự thật hiển nhiên hoặc một thói quen lặp đi lặp lại ở hiện tại.\n\n• Khẳng định: S + V(s/es)\n• Phủ định: S + do/does + not + V(nguyên thể)\n• Nghi vấn: Do/Does + S + V(nguyên thể)?',
              examples: [
                'I live in Hanoi.',
                'She works at a software company.',
                'They do not play football on Mondays.',
                'Does he speak English?'
              ],
              vocabulary: [
                { word: 'Always', type: 'adv', meaning: 'Luôn luôn (100%)' },
                { word: 'Usually', type: 'adv', meaning: 'Thường xuyên (80%)' },
                { word: 'Sometimes', type: 'adv', meaning: 'Thỉnh thoảng (50%)' },
                { word: 'Never', type: 'adv', meaning: 'Không bao giờ (0%)' }
              ]
            },
            exercises: [
              {
                type: 'multiple_choice',
                skill: 'Grammar',
                difficulty: 'A1',
                question: 'My brother _____ (play) guitar very well.',
                options: ['play', 'plays', 'is play', 'playing'],
                correct_answer: 'plays',
                explanation: '"My brother" là ngôi thứ 3 số ít (he) nên động từ play thêm "s" -> plays.',
                order_index: 1
              },
              {
                type: 'fill_blank',
                skill: 'Grammar',
                difficulty: 'A1',
                instructions: 'Điền trợ động từ phù hợp (do/does):',
                question: 'Where _____ you usually have lunch?',
                options: ['do', 'does', 'are', 'is'],
                correct_answer: 'do',
                explanation: 'Chủ ngữ "you" đi với trợ động từ "do".',
                order_index: 2
              }
            ]
          }
        ]
      }
    ]
  }
];
