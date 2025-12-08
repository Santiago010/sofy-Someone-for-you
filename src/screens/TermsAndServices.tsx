import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export default function TermsAndService() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView style={styles.container}>
      <View style={[styles.content, {paddingTop: insets.top + 20}]}>
        <Text style={styles.title}>Terms of Service</Text>
        <Text style={styles.lastUpdated}>Last Updated: November 18, 2025</Text>

        <Text style={styles.intro}>
          Welcome to Sofy. These Terms of Service ("Terms") govern your access
          to and use of our dating application and services. By creating an
          account or using Sofy, you agree to be bound by these Terms. If you do
          not agree to these Terms, please do not use our services.
        </Text>

        <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
        <Text style={styles.paragraph}>
          By accessing or using Sofy, you acknowledge that you have read,
          understood, and agree to be bound by these Terms of Service and our
          Privacy Policy. These Terms constitute a legally binding agreement
          between you and Sofy.
        </Text>

        <Text style={styles.sectionTitle}>2. Eligibility</Text>
        <Text style={styles.paragraph}>
          You must meet the following requirements to use Sofy:
        </Text>
        <Text style={styles.bulletPoint}>
          • You must be at least 18 years of age
        </Text>
        <Text style={styles.bulletPoint}>
          • You must have the legal capacity to enter into a binding contract
        </Text>
        <Text style={styles.bulletPoint}>
          • You must not be prohibited from using the service under applicable
          laws
        </Text>
        <Text style={styles.bulletPoint}>
          • You have not been previously banned or removed from Sofy
        </Text>
        <Text style={styles.paragraph}>
          By using our services, you represent and warrant that you meet all
          eligibility requirements. We reserve the right to verify your age and
          identity at any time.
        </Text>

        <Text style={styles.sectionTitle}>
          3. Account Registration and Security
        </Text>

        <Text style={styles.subsectionTitle}>3.1 Account Creation</Text>
        <Text style={styles.paragraph}>
          To use Sofy, you must create an account by providing:
        </Text>
        <Text style={styles.bulletPoint}>• Your first and last name</Text>
        <Text style={styles.bulletPoint}>• A valid email address</Text>
        <Text style={styles.bulletPoint}>• A secure password</Text>
        <Text style={styles.paragraph}>
          You must complete your profile by providing six (6) mandatory photos,
          your age, gender identity, gender interest, interests and
          sub-interests, and age range preferences.
        </Text>

        <Text style={styles.subsectionTitle}>
          3.2 Account Accuracy and Truthfulness
        </Text>
        <Text style={styles.paragraph}>You agree to:</Text>
        <Text style={styles.bulletPoint}>
          • Provide accurate, current, and complete information during
          registration
        </Text>
        <Text style={styles.bulletPoint}>
          • Use your real name and information
        </Text>
        <Text style={styles.bulletPoint}>
          • Upload photos that accurately represent your current appearance
        </Text>
        <Text style={styles.bulletPoint}>
          • Update your information promptly to maintain accuracy
        </Text>
        <Text style={styles.bulletPoint}>
          • Not impersonate any person or entity
        </Text>
        <Text style={styles.bulletPoint}>• Not create multiple accounts</Text>

        <Text style={styles.subsectionTitle}>3.3 Account Security</Text>
        <Text style={styles.paragraph}>
          You are responsible for maintaining the confidentiality of your
          password and account credentials. You agree to:
        </Text>
        <Text style={styles.bulletPoint}>
          • Not share your password with anyone
        </Text>
        <Text style={styles.bulletPoint}>
          • Notify us immediately of any unauthorized access or security breach
        </Text>
        <Text style={styles.bulletPoint}>
          • Be responsible for all activities that occur under your account
        </Text>
        <Text style={styles.paragraph}>
          You may optionally provide a phone number for password recovery
          purposes.
        </Text>

        <Text style={styles.sectionTitle}>4. User Content</Text>

        <Text style={styles.subsectionTitle}>4.1 Your Content</Text>
        <Text style={styles.paragraph}>
          You retain ownership of all content you submit to Sofy, including
          photos, messages, and profile information ("User Content"). By
          uploading or submitting User Content, you grant Sofy a worldwide,
          non-exclusive, royalty-free, transferable license to use, reproduce,
          modify, distribute, and display your User Content for the purpose of
          operating and providing our services.
        </Text>

        <Text style={styles.subsectionTitle}>
          4.2 Photo Requirements and Management
        </Text>
        <Text style={styles.paragraph}>
          All users must upload six (6) profile photos. Your photos must:
        </Text>
        <Text style={styles.bulletPoint}>• Show your face clearly</Text>
        <Text style={styles.bulletPoint}>
          • Be of you alone (no group photos as primary photos)
        </Text>
        <Text style={styles.bulletPoint}>
          • Be current and accurately represent your appearance
        </Text>
        <Text style={styles.bulletPoint}>
          • Not contain nudity, sexually explicit content, or violence
        </Text>
        <Text style={styles.bulletPoint}>
          • Not infringe on any third-party rights
        </Text>
        <Text style={styles.paragraph}>
          When you update or replace a photo, we permanently delete the previous
          photo from our servers.
        </Text>

        <Text style={styles.subsectionTitle}>4.3 Prohibited Content</Text>
        <Text style={styles.paragraph}>
          You may not upload, post, or share content that:
        </Text>
        <Text style={styles.bulletPoint}>
          • Contains nudity, sexually explicit material, or pornography
        </Text>
        <Text style={styles.bulletPoint}>
          • Depicts or promotes violence, harm, or illegal activities
        </Text>
        <Text style={styles.bulletPoint}>
          • Is hateful, discriminatory, or harassing based on race, ethnicity,
          religion, gender, sexual orientation, disability, or any other
          protected characteristic
        </Text>
        <Text style={styles.bulletPoint}>
          • Infringes on intellectual property rights of others
        </Text>
        <Text style={styles.bulletPoint}>
          • Contains malware, viruses, or malicious code
        </Text>
        <Text style={styles.bulletPoint}>
          • Promotes commercial activities or spam
        </Text>
        <Text style={styles.bulletPoint}>
          • Violates any applicable laws or regulations
        </Text>

        <Text style={styles.sectionTitle}>5. Acceptable Use and Conduct</Text>

        <Text style={styles.subsectionTitle}>5.1 Permitted Use</Text>
        <Text style={styles.paragraph}>
          Sofy is a dating platform designed to help users connect based on
          shared interests, preferences, and proximity. You may use the service
          to:
        </Text>
        <Text style={styles.bulletPoint}>
          • Create a profile and browse other users
        </Text>
        <Text style={styles.bulletPoint}>• Like or dislike profiles</Text>
        <Text style={styles.bulletPoint}>• Chat with matched users</Text>
        <Text style={styles.bulletPoint}>
          • Share messages, photos, and audio with matches
        </Text>
        <Text style={styles.bulletPoint}>
          • Update your profile information and preferences
        </Text>

        <Text style={styles.subsectionTitle}>5.2 Prohibited Conduct</Text>
        <Text style={styles.paragraph}>You agree not to:</Text>
        <Text style={styles.bulletPoint}>
          • Harass, abuse, threaten, or intimidate other users
        </Text>
        <Text style={styles.bulletPoint}>
          • Use the service for any commercial purposes without our written
          consent
        </Text>
        <Text style={styles.bulletPoint}>
          • Solicit money or donations from other users
        </Text>
        <Text style={styles.bulletPoint}>
          • Promote or advertise products or services
        </Text>
        <Text style={styles.bulletPoint}>
          • Use automated systems (bots, scrapers) to access the service
        </Text>
        <Text style={styles.bulletPoint}>
          • Reverse engineer, decompile, or disassemble any part of the app
        </Text>
        <Text style={styles.bulletPoint}>
          • Interfere with or disrupt the service or servers
        </Text>
        <Text style={styles.bulletPoint}>
          • Collect or harvest information about other users
        </Text>
        <Text style={styles.bulletPoint}>
          • Engage in catfishing or create fake profiles
        </Text>
        <Text style={styles.bulletPoint}>
          • Use the service if you are a registered sex offender
        </Text>
        <Text style={styles.bulletPoint}>• Engage in any illegal activity</Text>

        <Text style={styles.sectionTitle}>6. Location Services</Text>
        <Text style={styles.paragraph}>
          Sofy uses your device's geolocation data (latitude and longitude) to:
        </Text>
        <Text style={styles.bulletPoint}>
          • Show you users in your geographic proximity
        </Text>
        <Text style={styles.bulletPoint}>
          • Provide location-based recommendations
        </Text>
        <Text style={styles.bulletPoint}>• Enhance matching accuracy</Text>
        <Text style={styles.paragraph}>
          Location data is collected when you use the card swipe feature and
          requires your explicit permission. You can manage location permissions
          through your device settings, but disabling location may limit app
          functionality. Your exact location is never shared with other users;
          we only use it to determine proximity.
        </Text>

        <Text style={styles.sectionTitle}>7. Matching System</Text>
        <Text style={styles.paragraph}>
          Sofy uses an algorithm to provide personalized recommendations based
          on:
        </Text>
        <Text style={styles.bulletPoint}>
          • Your interests and sub-interests
        </Text>
        <Text style={styles.bulletPoint}>• Age range preferences</Text>
        <Text style={styles.bulletPoint}>• Gender preferences</Text>
        <Text style={styles.bulletPoint}>• Geographic proximity</Text>
        <Text style={styles.paragraph}>
          When two users mutually like each other, a "match" is created,
          enabling both users to initiate a conversation. We do not guarantee
          any specific number of matches or connections.
        </Text>

        <Text style={styles.sectionTitle}>8. Messaging and Communication</Text>
        <Text style={styles.paragraph}>
          Our messaging system is powered by CometChat, a third-party service
          provider. Once matched, users can:
        </Text>
        <Text style={styles.bulletPoint}>• Send text messages</Text>
        <Text style={styles.bulletPoint}>• Share photos</Text>
        <Text style={styles.bulletPoint}>• Send audio messages</Text>
        <Text style={styles.bulletPoint}>
          • See online/offline status of matches
        </Text>
        <Text style={styles.paragraph}>
          All communications are subject to these Terms and our Privacy Policy.
          We reserve the right to monitor communications for safety and
          compliance purposes.
        </Text>

        <Text style={styles.sectionTitle}>9. Intellectual Property</Text>

        <Text style={styles.subsectionTitle}>9.1 Sofy's Rights</Text>
        <Text style={styles.paragraph}>
          Sofy and its licensors own all rights, title, and interest in the app,
          including all software, technology, trademarks, logos, and content
          (excluding User Content). You may not copy, modify, distribute, sell,
          or lease any part of our services without our written permission.
        </Text>

        <Text style={styles.subsectionTitle}>9.2 Limited License</Text>
        <Text style={styles.paragraph}>
          We grant you a limited, non-exclusive, non-transferable, revocable
          license to access and use Sofy for personal, non-commercial purposes
          in accordance with these Terms.
        </Text>

        <Text style={styles.sectionTitle}>
          10. Content Moderation and Enforcement
        </Text>
        <Text style={styles.paragraph}>
          We reserve the right, but are not obligated, to:
        </Text>
        <Text style={styles.bulletPoint}>
          • Monitor and review User Content
        </Text>
        <Text style={styles.bulletPoint}>
          • Remove or refuse to display content that violates these Terms
        </Text>
        <Text style={styles.bulletPoint}>
          • Suspend or terminate accounts that violate these Terms
        </Text>
        <Text style={styles.bulletPoint}>
          • Report illegal activity to law enforcement
        </Text>
        <Text style={styles.bulletPoint}>
          • Take any action we deem necessary to protect the safety of our users
        </Text>

        <Text style={styles.sectionTitle}>
          11. Account Suspension and Termination
        </Text>

        <Text style={styles.subsectionTitle}>11.1 Termination by You</Text>
        <Text style={styles.paragraph}>
          You may delete your account at any time through the app settings. Upon
          deletion, your profile and personal information will be removed from
          our systems, subject to legal retention requirements.
        </Text>

        <Text style={styles.subsectionTitle}>11.2 Termination by Sofy</Text>
        <Text style={styles.paragraph}>
          We may suspend or terminate your account immediately, without prior
          notice or liability, if:
        </Text>
        <Text style={styles.bulletPoint}>
          • You violate these Terms of Service
        </Text>
        <Text style={styles.bulletPoint}>
          • You engage in fraudulent or illegal activity
        </Text>
        <Text style={styles.bulletPoint}>
          • You create a safety risk to other users
        </Text>
        <Text style={styles.bulletPoint}>
          • We are required to do so by law
        </Text>
        <Text style={styles.bulletPoint}>• We discontinue the service</Text>
        <Text style={styles.paragraph}>
          If your account is terminated for violation of these Terms, you may
          not create a new account without our permission.
        </Text>

        <Text style={styles.sectionTitle}>12. Disclaimers</Text>

        <Text style={styles.subsectionTitle}>12.1 No Warranties</Text>
        <Text style={styles.paragraph}>
          SOFY IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY
          KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED
          WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR
          NON-INFRINGEMENT.
        </Text>

        <Text style={styles.subsectionTitle}>12.2 User Interactions</Text>
        <Text style={styles.paragraph}>
          We do not conduct background checks on users. You are solely
          responsible for your interactions with other users. We do not
          guarantee:
        </Text>
        <Text style={styles.bulletPoint}>
          • The accuracy or truthfulness of user profiles
        </Text>
        <Text style={styles.bulletPoint}>
          • The identity or background of any user
        </Text>
        <Text style={styles.bulletPoint}>
          • That you will find compatible matches
        </Text>
        <Text style={styles.bulletPoint}>
          • The safety of in-person meetings
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>
            USE CAUTION AND COMMON SENSE WHEN INTERACTING WITH OTHER USERS,
            ESPECIALLY WHEN MEETING IN PERSON. NEVER SHARE FINANCIAL INFORMATION
            OR SEND MONEY TO PEOPLE YOU MEET ON SOFY.
          </Text>
        </Text>

        <Text style={styles.subsectionTitle}>12.3 Service Availability</Text>
        <Text style={styles.paragraph}>
          We do not guarantee that the service will be uninterrupted, secure, or
          error-free. We may modify, suspend, or discontinue the service at any
          time without notice.
        </Text>

        <Text style={styles.sectionTitle}>13. Limitation of Liability</Text>
        <Text style={styles.paragraph}>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, SOFY, ITS AFFILIATES,
          OFFICERS, DIRECTORS, EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE FOR ANY
          INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES,
          INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, USE, OR GOODWILL,
          ARISING OUT OF OR RELATED TO YOUR USE OF THE SERVICE.
        </Text>
        <Text style={styles.paragraph}>
          IN NO EVENT SHALL SOFY'S TOTAL LIABILITY TO YOU EXCEED THE AMOUNT YOU
          HAVE PAID TO SOFY IN THE TWELVE (12) MONTHS PRIOR TO THE EVENT GIVING
          RISE TO LIABILITY, OR ONE HUNDRED DOLLARS ($100), WHICHEVER IS
          GREATER.
        </Text>
        <Text style={styles.paragraph}>
          Some jurisdictions do not allow the exclusion or limitation of certain
          damages, so the above limitations may not apply to you.
        </Text>

        <Text style={styles.sectionTitle}>14. Indemnification</Text>
        <Text style={styles.paragraph}>
          You agree to indemnify, defend, and hold harmless Sofy, its
          affiliates, and their respective officers, directors, employees, and
          agents from and against any claims, liabilities, damages, losses,
          costs, or expenses (including reasonable attorneys' fees) arising out
          of or related to:
        </Text>
        <Text style={styles.bulletPoint}>• Your use of the service</Text>
        <Text style={styles.bulletPoint}>• Your User Content</Text>
        <Text style={styles.bulletPoint}>• Your violation of these Terms</Text>
        <Text style={styles.bulletPoint}>
          • Your violation of any rights of another person or entity
        </Text>
        <Text style={styles.bulletPoint}>
          • Your interactions with other users
        </Text>

        <Text style={styles.sectionTitle}>15. Third-Party Services</Text>
        <Text style={styles.paragraph}>
          Sofy uses CometChat for messaging functionality. CometChat is a
          third-party service with its own terms of service and privacy policy.
          We are not responsible for the practices, performance, or availability
          of CometChat or any other third-party services integrated into our
          app.
        </Text>

        <Text style={styles.sectionTitle}>
          16. Governing Law and Dispute Resolution
        </Text>

        <Text style={styles.subsectionTitle}>16.1 Governing Law</Text>
        <Text style={styles.paragraph}>
          These Terms shall be governed by and construed in accordance with the
          laws of the United States, without regard to its conflict of law
          provisions.
        </Text>

        <Text style={styles.subsectionTitle}>16.2 Dispute Resolution</Text>
        <Text style={styles.paragraph}>
          Any dispute arising out of or relating to these Terms or the service
          shall be resolved through binding arbitration in accordance with the
          rules of the American Arbitration Association. You waive your right to
          a jury trial and to participate in class action lawsuits.
        </Text>

        <Text style={styles.subsectionTitle}>16.3 Exceptions</Text>
        <Text style={styles.paragraph}>
          Either party may seek injunctive or other equitable relief in any
          court of competent jurisdiction to prevent the actual or threatened
          infringement, misappropriation, or violation of intellectual property
          rights.
        </Text>

        <Text style={styles.sectionTitle}>17. Changes to These Terms</Text>
        <Text style={styles.paragraph}>
          We reserve the right to modify these Terms at any time. We will notify
          you of material changes by:
        </Text>
        <Text style={styles.bulletPoint}>
          • Posting the updated Terms in the app
        </Text>
        <Text style={styles.bulletPoint}>
          • Updating the "Last Updated" date
        </Text>
        <Text style={styles.bulletPoint}>
          • Sending you an in-app notification or email
        </Text>
        <Text style={styles.paragraph}>
          Your continued use of Sofy after changes are posted constitutes your
          acceptance of the updated Terms. If you do not agree to the changes,
          you must stop using the service and delete your account.
        </Text>

        <Text style={styles.sectionTitle}>
          18. Additional Terms for App Stores
        </Text>

        <Text style={styles.subsectionTitle}>18.1 Apple App Store</Text>
        <Text style={styles.paragraph}>
          If you download Sofy from the Apple App Store, you acknowledge and
          agree that:
        </Text>
        <Text style={styles.bulletPoint}>
          • These Terms are between you and Sofy, not Apple
        </Text>
        <Text style={styles.bulletPoint}>
          • Apple has no obligation to provide support or maintenance
        </Text>
        <Text style={styles.bulletPoint}>
          • Apple is not responsible for the app or its content
        </Text>
        <Text style={styles.bulletPoint}>
          • Apple is a third-party beneficiary of these Terms and may enforce
          them
        </Text>

        <Text style={styles.subsectionTitle}>18.2 Google Play Store</Text>
        <Text style={styles.paragraph}>
          If you download Sofy from Google Play, you agree to comply with Google
          Play's Terms of Service and acknowledge that Google is not responsible
          for the app or its content.
        </Text>

        <Text style={styles.sectionTitle}>19. Severability</Text>
        <Text style={styles.paragraph}>
          If any provision of these Terms is found to be invalid or
          unenforceable, the remaining provisions shall continue in full force
          and effect.
        </Text>

        <Text style={styles.sectionTitle}>20. Entire Agreement</Text>
        <Text style={styles.paragraph}>
          These Terms, together with our Privacy Policy, constitute the entire
          agreement between you and Sofy regarding the use of our services and
          supersede all prior agreements and understandings.
        </Text>

        <Text style={styles.sectionTitle}>21. Contact Us</Text>
        <Text style={styles.paragraph}>
          If you have any questions, concerns, or complaints regarding these
          Terms of Service, please contact us at:
        </Text>
        <Text style={styles.contactInfo}>Email: legal@sofy.app</Text>
        <Text style={styles.contactInfo}>Support: support@sofy.app</Text>

        <Text style={styles.acknowledgment}>
          By using Sofy, you acknowledge that you have read, understood, and
          agree to be bound by these Terms of Service.
        </Text>

        <View style={styles.footer} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000',
  },
  lastUpdated: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  intro: {
    fontSize: 15,
    lineHeight: 22,
    color: '#333',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 12,
    color: '#000',
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    color: '#000',
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 22,
    color: '#333',
    marginBottom: 12,
  },
  bold: {
    fontWeight: '600',
    color: '#000',
  },
  bulletPoint: {
    fontSize: 15,
    lineHeight: 22,
    color: '#333',
    marginLeft: 16,
    marginBottom: 6,
  },
  contactInfo: {
    fontSize: 15,
    lineHeight: 22,
    color: '#007AFF',
    marginLeft: 16,
    marginBottom: 6,
  },
  acknowledgment: {
    fontSize: 15,
    lineHeight: 22,
    color: '#333',
    marginTop: 24,
    fontStyle: 'italic',
  },
  footer: {
    height: 20,
  },
});
