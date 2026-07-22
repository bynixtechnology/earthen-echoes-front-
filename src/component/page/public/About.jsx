import React from 'react'
import AboutHeroSection from '../../core/About/AboutHeroSection'

import AboutJourney from '../../core/About/AboutJourney'
import AboutWorkflow from '../../core/About/AboutWorkflow'
import MeetTeam from '../../core/About/MeetTeam'
import AboutSustainability from '../../core/About/AboutSustainability'

const About = () => {
  return (
    <>
      <AboutHeroSection />
      <AboutJourney />
      <AboutWorkflow />
      <MeetTeam />
      <AboutSustainability />
    </>
  )
}

export default About