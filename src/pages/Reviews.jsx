import { useEffect, useState } from "react";
import axios from "axios";
import { Star, ThumbsUp, Loader2, MessageCircle } from "lucide-react";
import Card, { CardContent } from "../components/ui/Card";

const API = "http://localhost:5000/api/reviews";

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const token = localStorage.getItem("token");

      const { data } = await axios.get(API, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setReviews(data.reviews || []);
    } catch (error) {
      console.log("Reviews error:", error);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating
            ? "text-yellow-400 fill-yellow-400"
            : "text-gray-300"
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[300px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold">
          Traveler Reviews
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1">
          Real experiences from travelers across Rwanda & beyond
        </p>
      </div>

      {/* EMPTY STATE */}
      {reviews.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-10 text-center">
          <MessageCircle className="mx-auto mb-3 text-gray-400" size={40} />
          <h2 className="text-xl font-semibold">
            No Reviews Yet
          </h2>
          <p className="text-gray-500 mt-2">
            Reviews will appear once travelers start sharing experiences.
          </p>
        </div>
      ) : (
        <div className="space-y-4">

          {reviews.map((review) => (
            <Card
              key={review._id}
              className="hover:shadow-lg transition"
            >
              <CardContent className="p-6">

                {/* TOP */}
                <div className="flex justify-between items-start mb-4">

                  <div>
                    <h3 className="font-semibold text-lg">
                      {review.user?.name || "Anonymous"}
                    </h3>

                    <p className="text-sm text-gray-500">
                      {review.tour?.title || review.destination}
                    </p>
                  </div>

                  <div className="flex items-center gap-1">
                    {renderStars(review.rating)}
                    <span className="ml-2 font-semibold">
                      {review.rating}
                    </span>
                  </div>

                </div>

                {/* COMMENT */}
                <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                  {review.comment}
                </p>

                {/* BOTTOM */}
                <div className="flex items-center justify-between">

                  <span className="text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>

                  <button className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition">
                    <ThumbsUp className="w-4 h-4" />
                    <span className="text-sm">
                      Helpful ({review.helpful || 0})
                    </span>
                  </button>

                </div>

              </CardContent>
            </Card>
          ))}

        </div>
      )}
    </div>
  );
};

export default Reviews;