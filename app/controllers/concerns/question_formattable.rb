module QuestionFormattable
  def format_questions_and_choices(questions_and_choices)
    questions_and_choices.each do |question|
      # delete empty elements in choices
      question[:choices].reject! { |choice| choice.empty?}
      # delete choices key if empty
      question.delete(:choices) if question[:choices].empty?
    end

    # delete empty questions and questions with no choices, unless question_type is stars
    questions_and_choices = questions_and_choices.reject do |question|
      question[:question].empty? || (question[:question_type] != 'stars' && question[:choices].nil?)
    end

    questions_and_choices.map!(&:to_unsafe_h)

    return questions_and_choices
  end
end
