import React from 'react';
import { Link } from 'react-router-dom';
import { Recycle, Heart, Users, Zap, ArrowRight, Shirt, Award, Shield } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex justify-center mb-8">
            <div className="bg-green-100 p-4 rounded-full">
              <Recycle className="h-16 w-16 text-green-600" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Sustainable Fashion
            <span className="text-green-600 block">Starts Here</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Join ReWear's community-driven clothing exchange platform. Give your unused clothes a new life 
            through direct swaps or our innovative points system. Fashion that's good for you and the planet.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Start Swapping
              <ArrowRight className="inline-block ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/browse"
              className="bg-white text-green-600 px-8 py-4 rounded-lg text-lg font-semibold border-2 border-green-600 hover:bg-green-50 transition-all duration-300"
            >
              Browse Items
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How ReWear Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Three simple ways to give your clothes a new life and build a sustainable wardrobe
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-xl bg-gradient-to-br from-green-50 to-green-100 hover:shadow-lg transition-all duration-300">
              <div className="bg-green-600 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <Shirt className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">List Your Items</h3>
              <p className="text-gray-600 leading-relaxed">
                Upload photos and details of clothes you no longer wear. Our AI helps generate beautiful listings.
              </p>
            </div>

            <div className="text-center p-8 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-lg transition-all duration-300">
              <div className="bg-blue-600 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Connect & Swap</h3>
              <p className="text-gray-600 leading-relaxed">
                Find items you love and propose direct swaps with other community members.
              </p>
            </div>

            <div className="text-center p-8 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 hover:shadow-lg transition-all duration-300">
              <div className="bg-orange-600 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Earn Points</h3>
              <p className="text-gray-600 leading-relaxed">
                Earn points for every item you list and redeem them for clothes you want.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h2 className="text-4xl font-bold mb-4">Impact That Matters</h2>
            <p className="text-xl opacity-90 mb-12">Join thousands making fashion more sustainable</p>
            
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">10,000+</div>
                <div className="text-lg opacity-90">Items Exchanged</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">5,000+</div>
                <div className="text-lg opacity-90">Active Members</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">50 Tons</div>
                <div className="text-lg opacity-90">Waste Prevented</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">98%</div>
                <div className="text-lg opacity-90">Satisfaction Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Why Choose ReWear?
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <Heart className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Environmental Impact</h3>
                    <p className="text-gray-600">Reduce textile waste and carbon footprint with every swap.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Zap className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Matching</h3>
                    <p className="text-gray-600">AI-powered recommendations help you find perfect matches.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <Shield className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Safe & Secure</h3>
                    <p className="text-gray-600">Verified users, secure transactions, and quality moderation.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-xl">
              <img 
                src="https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=600" 
                alt="Sustainable fashion" 
                className="w-full h-64 object-cover rounded-xl mb-6"
              />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Start?</h3>
              <p className="text-gray-600 mb-6">
                Join our community today and discover a new way to refresh your wardrobe sustainably.
              </p>
              <Link
                to="/register"
                className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors text-center block"
              >
                Join ReWear Community
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}