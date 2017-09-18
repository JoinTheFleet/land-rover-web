class ActiveSupport::TimeWithZone
  # Convert all outputted DateTimes to Unix Timestamp.
  def as_json(_options = {})
    to_time.to_i
  end
end
