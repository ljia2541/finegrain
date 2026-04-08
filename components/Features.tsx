export default function Features() {
  const features = [
    {
      icon: '⚡',
      title: 'Fast Processing',
      description: 'Upload and process in seconds. Most images enhanced in under 60 seconds.',
    },
    {
      icon: '🔒',
      title: 'Secure & Private',
      description: 'Images are automatically deleted 24 hours after upload. Your data is never shared.',
    },
    {
      icon: '🎯',
      title: 'Multiple Models',
      description: 'Choose from 4 professional models optimized for different use cases.',
    },
    {
      icon: '📱',
      title: 'Works Anywhere',
      description: 'Perfect for portraits, landscapes, products, AI art, and more.',
    },
    {
      icon: '🌐',
      title: 'No Software Needed',
      description: 'Runs entirely in your browser. No downloads or installations required.',
    },
    {
      icon: '💯',
      title: '100% Free to Start',
      description: '3 free enhancements daily. No credit card required.',
    },
  ]

  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Finegrain?</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Finegrain uses advanced AI super resolution technology to upscale images while preserving natural quality.
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="text-3xl mb-4">{feature.icon}</div>
            <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
            <p className="text-sm text-gray-500">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
