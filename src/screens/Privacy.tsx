import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export default function Privacy() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView style={styles.container}>
      <View style={[styles.content, {paddingTop: insets.top + 20}]}>
        <Text style={styles.title}>Privacy Policy</Text>
        <Text style={styles.lastUpdated}>Last Updated: November 18, 2025</Text>

        <Text style={styles.intro}>
          Welcome to Sofy ("we," "our," or "us"). This Privacy Policy explains
          how we collect, use, disclose, and protect your information when you
          use our dating application and services. By using Sofy, you agree to
          the collection and use of information in accordance with this policy.
        </Text>

        <Text style={styles.sectionTitle}>1. Information We Collect</Text>

        <Text style={styles.subsectionTitle}>
          1.1 Information You Provide to Us
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>Account Registration:</Text> When you create
          an account, we collect your first name, last name, email address, and
          password.
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>Profile Information:</Text> To complete your
          profile, we collect:
        </Text>
        <Text style={styles.bulletPoint}>
          • Six (6) profile photos (mandatory)
        </Text>
        <Text style={styles.bulletPoint}>• Your age</Text>
        <Text style={styles.bulletPoint}>• Your gender identity</Text>
        <Text style={styles.bulletPoint}>
          • Your gender interest (the gender you wish to see on the app)
        </Text>
        <Text style={styles.bulletPoint}>
          • Your interests and sub-interests
        </Text>
        <Text style={styles.bulletPoint}>
          • Age range preferences for potential matches
        </Text>
        <Text style={styles.bulletPoint}>
          • Phone number (optional, for password recovery purposes)
        </Text>

        <Text style={styles.paragraph}>
          <Text style={styles.bold}>Photos:</Text> All photos you upload are
          used to display your profile to other users. When you update or change
          a photo, we permanently delete the previous photo from our servers and
          do not retain copies.
        </Text>

        <Text style={styles.subsectionTitle}>
          1.2 Information We Collect Automatically
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>Location Data:</Text> We collect your
          device's geolocation data (latitude and longitude) to show you users
          in your geographic proximity and provide location-based
          recommendations. This data is collected when you use the card swipe
          feature and requires your explicit permission.
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>Usage Information:</Text> We collect
          information about your interactions with the app, including likes,
          dislikes, matches, and messaging activity.
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>Device Information:</Text> We may collect
          information about your device, including device type, operating
          system, unique device identifiers, and mobile network information.
        </Text>

        <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
        <Text style={styles.paragraph}>
          We use the information we collect for the following purposes:
        </Text>
        <Text style={styles.bulletPoint}>
          • To create and manage your account
        </Text>
        <Text style={styles.bulletPoint}>
          • To display your profile to other users
        </Text>
        <Text style={styles.bulletPoint}>
          • To provide personalized recommendations based on interests, age
          preferences, gender preferences, and location proximity
        </Text>
        <Text style={styles.bulletPoint}>
          • To enable the like/dislike functionality and match system
        </Text>
        <Text style={styles.bulletPoint}>
          • To facilitate communication between matched users through our chat
          system
        </Text>
        <Text style={styles.bulletPoint}>
          • To allow password recovery via phone number
        </Text>
        <Text style={styles.bulletPoint}>
          • To improve our services and develop new features
        </Text>
        <Text style={styles.bulletPoint}>
          • To ensure safety and prevent fraud or abuse
        </Text>
        <Text style={styles.bulletPoint}>
          • To comply with legal obligations
        </Text>

        <Text style={styles.sectionTitle}>
          3. Information Sharing and Disclosure
        </Text>

        <Text style={styles.subsectionTitle}>3.1 With Other Users</Text>
        <Text style={styles.paragraph}>
          Your profile information, including photos, age, gender, and
          interests, is visible to other users based on your preferences and our
          matching algorithm. Your exact location is never shared; we only use
          location data to determine proximity.
        </Text>

        <Text style={styles.subsectionTitle}>3.2 With Service Providers</Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>CometChat:</Text> We use CometChat as our
          messaging service provider. When you engage in conversations with
          matches, messages, photos, audio, and online/offline status are
          processed through CometChat's infrastructure. CometChat's privacy
          practices are governed by their own privacy policy.
        </Text>
        <Text style={styles.paragraph}>
          We may share information with other third-party service providers who
          perform services on our behalf, such as hosting, analytics, and
          customer support.
        </Text>

        <Text style={styles.subsectionTitle}>3.3 Legal Requirements</Text>
        <Text style={styles.paragraph}>
          We may disclose your information if required to do so by law or in
          response to valid requests by public authorities (e.g., court orders,
          subpoenas, or government agencies).
        </Text>

        <Text style={styles.subsectionTitle}>3.4 Business Transfers</Text>
        <Text style={styles.paragraph}>
          In the event of a merger, acquisition, reorganization, or sale of
          assets, your information may be transferred as part of that
          transaction.
        </Text>

        <Text style={styles.sectionTitle}>4. Data Retention</Text>
        <Text style={styles.paragraph}>
          We retain your personal information for as long as your account is
          active or as needed to provide you services. If you delete your
          account, we will delete your personal information, including all
          photos, within a reasonable timeframe, except where we are required to
          retain it for legal purposes.
        </Text>
        <Text style={styles.paragraph}>
          When you replace a photo, the previous photo is immediately and
          permanently deleted from our servers.
        </Text>

        <Text style={styles.sectionTitle}>5. Your Rights and Choices</Text>

        <Text style={styles.subsectionTitle}>5.1 Access and Update</Text>
        <Text style={styles.paragraph}>
          You can access and update your profile information, including photos,
          interests, age range preferences, gender preferences, and phone
          number, at any time through the app settings.
        </Text>

        <Text style={styles.subsectionTitle}>5.2 Location Data</Text>
        <Text style={styles.paragraph}>
          You can control location permissions through your device settings.
          However, disabling location access may limit functionality,
          particularly the ability to discover nearby users.
        </Text>

        <Text style={styles.subsectionTitle}>5.3 Account Deletion</Text>
        <Text style={styles.paragraph}>
          You may delete your account at any time. Upon deletion, your profile
          and personal information will be removed from our systems, subject to
          legal retention requirements.
        </Text>

        <Text style={styles.subsectionTitle}>
          5.4 Communication Preferences
        </Text>
        <Text style={styles.paragraph}>
          You can manage your communication preferences and opt out of
          promotional messages, though we may still send you service-related
          communications.
        </Text>

        <Text style={styles.sectionTitle}>6. Data Security</Text>
        <Text style={styles.paragraph}>
          We implement appropriate technical and organizational measures to
          protect your personal information against unauthorized access,
          alteration, disclosure, or destruction. However, no method of
          transmission over the internet or electronic storage is 100% secure,
          and we cannot guarantee absolute security.
        </Text>
        <Text style={styles.paragraph}>
          Your password is encrypted and stored securely. We recommend using a
          strong, unique password for your account.
        </Text>

        <Text style={styles.sectionTitle}>7. Children's Privacy</Text>
        <Text style={styles.paragraph}>
          Our services are not intended for users under the age of 18. We do not
          knowingly collect personal information from individuals under 18. If
          we become aware that we have collected personal information from
          someone under 18, we will take steps to delete that information.
        </Text>

        <Text style={styles.sectionTitle}>8. International Data Transfers</Text>
        <Text style={styles.paragraph}>
          Your information may be transferred to and processed in countries
          other than your country of residence. These countries may have
          different data protection laws. By using our services, you consent to
          the transfer of your information to our facilities and to the third
          parties with whom we share it.
        </Text>

        <Text style={styles.sectionTitle}>9. Third-Party Services</Text>
        <Text style={styles.paragraph}>
          Our app uses CometChat for messaging functionality, including text
          messages, photo sharing, audio messages, and online/offline status
          indicators. We are not responsible for the privacy practices of
          CometChat or other third-party services. We encourage you to review
          their privacy policies.
        </Text>

        <Text style={styles.sectionTitle}>
          10. Changes to This Privacy Policy
        </Text>
        <Text style={styles.paragraph}>
          We may update this Privacy Policy from time to time. We will notify
          you of any significant changes by posting the new Privacy Policy in
          the app and updating the "Last Updated" date. Your continued use of
          the app after changes are posted constitutes your acceptance of the
          updated policy.
        </Text>

        <Text style={styles.sectionTitle}>
          11. Your California Privacy Rights
        </Text>
        <Text style={styles.paragraph}>
          If you are a California resident, you have specific rights under the
          California Consumer Privacy Act (CCPA), including the right to:
        </Text>
        <Text style={styles.bulletPoint}>
          • Know what personal information we collect, use, and share
        </Text>
        <Text style={styles.bulletPoint}>
          • Request deletion of your personal information
        </Text>
        <Text style={styles.bulletPoint}>
          • Opt out of the sale of your personal information (we do not sell
          your personal information)
        </Text>
        <Text style={styles.bulletPoint}>
          • Non-discrimination for exercising your privacy rights
        </Text>

        <Text style={styles.sectionTitle}>
          12. European Users - GDPR Rights
        </Text>
        <Text style={styles.paragraph}>
          If you are located in the European Economic Area (EEA) or United
          Kingdom, you have certain rights under the General Data Protection
          Regulation (GDPR), including:
        </Text>
        <Text style={styles.bulletPoint}>
          • Right of access to your personal data
        </Text>
        <Text style={styles.bulletPoint}>
          • Right to rectification of inaccurate data
        </Text>
        <Text style={styles.bulletPoint}>
          • Right to erasure ("right to be forgotten")
        </Text>
        <Text style={styles.bulletPoint}>• Right to restrict processing</Text>
        <Text style={styles.bulletPoint}>• Right to data portability</Text>
        <Text style={styles.bulletPoint}>• Right to object to processing</Text>
        <Text style={styles.bulletPoint}>
          • Right to withdraw consent at any time
        </Text>

        <Text style={styles.acknowledgment}>
          By using Sofy, you acknowledge that you have read and understood this
          Privacy Policy and agree to its terms.
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
