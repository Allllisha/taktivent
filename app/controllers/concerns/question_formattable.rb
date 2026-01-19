module QuestionFormattable
  # format params[:review][:questions_and_choices] before saving into db
  def format_questions_and_choices(questions_and_choices)
    questions_and_choices.each do |question|
      # delete empty elements in :choices, which are caused by either empty inputs or question_type being stars
      question[:choices].reject! { |choice| choice.empty?}
      # delete :choices key if empty
      question.delete(:choices) if question[:choices].empty?
    end

    # delete empty questions and questions with no :choices key, unless question_type is stars
    questions_and_choices = questions_and_choices.reject do |question|
      question[:question].empty? || (question[:question_type] != 'stars' && question[:choices].nil?)
    end

    # transform ActionController::Parameters into hash
    questions_and_choices.map!(&:to_unsafe_h)

    return questions_and_choices
  end
end
