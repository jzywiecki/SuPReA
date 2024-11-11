import React, { forwardRef } from "react";

// Forwarding ref to the component
const IntroductionWithPicture = forwardRef(
  ({ title, subtitle, description, features, imageSrc, imageAlt }, ref) => (
    <div ref={ref} className="overflow-hidden py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          
          {/* Text Section */}
          <div className="lg:pr-8 lg:pt-4">
            <div className="lg:max-w-lg">
              <h2 className="text-base/7 font-semibold text-indigo-600">{title}</h2>
              <p className="mt-2 text-pretty text-4xl font-semibold tracking-tight sm:text-5xl">
                {subtitle}
              </p>
              <p className="mt-6 text-lg/8 text-gray-600">
                {description}
              </p>
              <dl className="mt-10 max-w-xl space-y-8 text-base/7 text-gray-600 lg:max-w-none">
                {features.map((feature) => (
                  <div key={feature.name} className="relative pl-9">
                    <dt className="inline font-semibold">{feature.name}</dt>{' '}
                    <dd className="inline">{feature.description}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
          
          {/* Image Section */}
          <img
            alt={imageAlt}
            src={imageSrc}
            width={2432}
            height={1442}
            className="w-[48rem] max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 sm:w-[57rem] md:-ml-4 lg:-ml-0"
          />
        </div>
      </div>
    </div>
  )
);

export default IntroductionWithPicture;
