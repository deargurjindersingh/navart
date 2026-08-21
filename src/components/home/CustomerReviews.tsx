import React from 'react';
import { Star, CheckCircle, Quote } from 'lucide-react';

export const CustomerReviews: React.FC = () => {
  const reviews = [
    {
      id: 'rev-1',
      name: 'Aditi & Kunal Sen',
      location: 'Bengaluru, KA',
      avatar: 'https://picsum.photos/seed/1534528741775-53994a69daeb/800/600',
      artType: 'Graphite Pencil (A2 Size with Oak Frame)',
      rating: 5,
      date: '2 days ago',
      title: 'Brought tears to my grandparents’ eyes!',
      comment: 'We combined three separate low-res photos of our grandparents from the 1970s. Master artist Elena merged them into a unified sketch so seamlessly. The digital proof approval let us tweak my grandfather’s spectacles before it was finalized. Outstanding craftsmanship!',
      artworkImage: 'https://picsum.photos/seed/1579783902614-a3fb3927b675/800/600',
    },
    {
      id: 'rev-2',
      name: 'Dr. Siddharth Varma',
      location: 'New Delhi, DL',
      avatar: 'https://picsum.photos/seed/1507003211169-0a1dd7228f2d/800/600',
      artType: 'Oil on Stretched Canvas (24x36")',
      rating: 5,
      date: '1 week ago',
      title: 'Museum grade quality in our living room',
      comment: 'Ordered a 10th anniversary oil painting. The depth of the brushwork and the gold frame is magnificent. Tracking the order through each stage from photo verification to artist assignment gave complete peace of mind.',
      artworkImage: 'https://picsum.photos/seed/1578925518470-4def7a0f08bb/800/600',
    },
    {
      id: 'rev-3',
      name: 'Meera Nambiar',
      location: 'Kochi, KL',
      avatar: 'https://picsum.photos/seed/1573496359142-b8d87734a5a2/800/600',
      artType: 'Watercolor Pet Memorial',
      rating: 5,
      date: '2 weeks ago',
      title: 'Captured our Labrador’s soulful spirit perfectly',
      comment: 'After our beloved golden retriever passed away, Ananya painted this soft watercolor with floral splashes. The free revision process was so respectful and accommodating. We treasure this piece every single day.',
      artworkImage: 'https://picsum.photos/seed/1544967082-d9d25d867d66/800/600',
    },
  ];

  return (
    <section className="py-20 bg-slate-50 border-t border-slate-200">
      <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="flex items-center justify-center gap-1 text-amber-500 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
            Treasured by Over 14,500+ Homes
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            Real stories and verified photos from clients who commissioned personal portraits with us.
          </p>
        </div>

        {/* Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[11px] text-slate-400">{rev.date}</span>
                </div>

                <h3 className="font-serif font-bold text-slate-900 text-base mb-2">
                  "{rev.title}"
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed italic mb-6">
                  {rev.comment}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={rev.avatar}
                    alt={rev.name}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1">
                      <span>{rev.name}</span>
                      <CheckCircle className="w-3 h-3 text-emerald-600 fill-emerald-100" />
                    </div>
                    <div className="text-[10px] text-slate-500">{rev.location}</div>
                  </div>
                </div>

                <img
                  src={rev.artworkImage}
                  alt="Commission Proof"
                  className="w-10 h-10 rounded-lg object-cover border border-slate-200 shadow-xs"
                  title={rev.artType}
                />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
