import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Star, ThumbsUp, ThumbsDown, Meh } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { useSubmitFeedback, useSiteVisits } from "@/hooks/useSiteVisits";
import { cn } from "@/lib/utils";

const interestLevels = [
  { value: "very_interested", label: "Very Interested", icon: ThumbsUp, color: "bg-status-hot text-white" },
  { value: "interested", label: "Interested", icon: ThumbsUp, color: "bg-status-warm text-white" },
  { value: "neutral", label: "Neutral", icon: Meh, color: "bg-status-cold text-white" },
  { value: "not_interested", label: "Not Interested", icon: ThumbsDown, color: "bg-status-lost text-white" },
];

export default function SiteVisitFeedback() {
  const navigate = useNavigate();
  const { id } = useParams();
  const submitFeedback = useSubmitFeedback();
  const { data: siteVisits } = useSiteVisits();
  
  const siteVisit = siteVisits?.find((sv) => sv.id === id);
  
  const [rating, setRating] = useState(0);
  const [interestLevel, setInterestLevel] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id || rating === 0 || !interestLevel) return;

    try {
      await submitFeedback.mutateAsync({
        id,
        feedback_rating: rating,
        feedback_notes: notes,
        feedback_interest_level: interestLevel,
      });
      
      navigate(-1);
    } catch (error) {
      // Error handled by mutation
    }
  };

  return (
    <AppShell showFab={false} showBottomNav={false}>
      {/* Header */}
      <header className="bg-primary text-primary-foreground px-4 pt-12 pb-6">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate(-1)}
            className="touch-btn w-10 h-10 rounded-full bg-primary-foreground/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold">Site Visit Feedback</h1>
            {siteVisit && (
              <p className="text-sm opacity-70">{siteVisit.leads?.name} - {siteVisit.projects?.name}</p>
            )}
          </div>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="flex-1 px-4 py-6 space-y-4">
        {/* Star Rating */}
        <div className="crm-card">
          <label className="text-sm font-semibold text-foreground mb-4 block text-center">
            How was the site visit experience?
          </label>
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="touch-btn"
              >
                <Star
                  className={cn(
                    "w-10 h-10 transition-colors",
                    star <= rating
                      ? "fill-accent text-accent"
                      : "text-muted-foreground"
                  )}
                />
              </button>
            ))}
          </div>
          <p className="text-center text-sm text-muted-foreground mt-2">
            {rating === 0 && "Tap to rate"}
            {rating === 1 && "Poor"}
            {rating === 2 && "Fair"}
            {rating === 3 && "Good"}
            {rating === 4 && "Very Good"}
            {rating === 5 && "Excellent"}
          </p>
        </div>

        {/* Interest Level */}
        <div className="crm-card">
          <label className="text-sm font-semibold text-foreground mb-4 block">
            Client's Interest Level
          </label>
          <div className="grid grid-cols-2 gap-3">
            {interestLevels.map((level) => (
              <button
                key={level.value}
                type="button"
                onClick={() => setInterestLevel(level.value)}
                className={cn(
                  "flex items-center gap-2 py-3 px-4 rounded-xl transition-all border-2",
                  interestLevel === level.value
                    ? `${level.color} border-transparent`
                    : "bg-muted border-transparent hover:border-primary/20"
                )}
              >
                <level.icon className="w-5 h-5" />
                <span className="text-sm font-medium">{level.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Feedback Notes */}
        <div className="crm-card">
          <label className="text-sm font-semibold text-foreground mb-3 block">
            Detailed Feedback
          </label>
          <textarea
            placeholder="What were the client's comments? Any objections? What plots did they like?"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={5}
            className="w-full px-4 py-3 rounded-xl bg-muted border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-4 pb-8">
          <button
            type="submit"
            disabled={submitFeedback.isPending || rating === 0 || !interestLevel}
            className="w-full h-14 rounded-xl bg-primary text-primary-foreground font-semibold text-base hover:opacity-90 transition-opacity disabled:opacity-70"
          >
            {submitFeedback.isPending ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Submitting...
              </span>
            ) : (
              "Submit Feedback"
            )}
          </button>
        </div>
      </form>
    </AppShell>
  );
}
