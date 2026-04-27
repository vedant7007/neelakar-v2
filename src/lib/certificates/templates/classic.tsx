import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import type { CertificateData } from '..'

const styles = StyleSheet.create({
  page: { backgroundColor: '#F5F0E8', padding: 60, position: 'relative' },
  border: { position: 'absolute', top: 30, left: 30, right: 30, bottom: 30, borderWidth: 2, borderColor: '#C9561E', borderStyle: 'solid' },
  innerBorder: { position: 'absolute', top: 36, left: 36, right: 36, bottom: 36, borderWidth: 0.5, borderColor: '#C9561E', borderStyle: 'solid' },
  content: { alignItems: 'center', paddingTop: 40 },
  logo: { fontSize: 14, fontFamily: 'Helvetica-Bold', letterSpacing: 4, color: '#141414', marginBottom: 8 },
  logoAccent: { color: '#C9561E' },
  title: { fontSize: 32, fontFamily: 'Helvetica-Bold', color: '#141414', marginTop: 30, marginBottom: 6 },
  subtitle: { fontSize: 11, color: '#666', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 40 },
  body: { fontSize: 13, color: '#333', textAlign: 'center', lineHeight: 1.8, maxWidth: 380, marginBottom: 10 },
  name: { fontSize: 28, fontFamily: 'Helvetica-Bold', color: '#C9561E', marginBottom: 16 },
  workshop: { fontSize: 16, fontFamily: 'Helvetica-Bold', color: '#141414', marginBottom: 30 },
  details: { fontSize: 10, color: '#666', textAlign: 'center', lineHeight: 1.6, marginBottom: 30 },
  customLine: { fontSize: 11, color: '#C9561E', fontFamily: 'Helvetica-Oblique', marginBottom: 30 },
  divider: { width: 80, height: 1, backgroundColor: '#C9561E', marginBottom: 30 },
  signatureRow: { flexDirection: 'row', justifyContent: 'space-between', width: '80%', marginTop: 20 },
  signature: { alignItems: 'center' },
  signatureLine: { width: 120, height: 0.5, backgroundColor: '#141414', marginBottom: 6 },
  signatureLabel: { fontSize: 9, color: '#666' },
})

export function ClassicTemplate(props: CertificateData) {
  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.border} />
        <View style={styles.innerBorder} />
        <View style={styles.content}>
          <Text style={styles.logo}>NEELAKAR <Text style={styles.logoAccent}>CREATIVE HOUSE</Text></Text>
          <Text style={styles.title}>{props.title || 'Certificate of Completion'}</Text>
          <Text style={styles.subtitle}>This certifies that</Text>
          <Text style={styles.name}>{props.participantName}</Text>
          <Text style={styles.body}>{props.body || `has successfully completed the workshop`}</Text>
          <Text style={styles.workshop}>{props.workshopTitle}</Text>
          <Text style={styles.details}>
            {props.dates} &bull; {props.location}{'\n'}
            Instructor: {props.instructor}
          </Text>
          {props.customLine && <Text style={styles.customLine}>{props.customLine}</Text>}
          <View style={styles.divider} />
          <View style={styles.signatureRow}>
            <View style={styles.signature}>
              <View style={styles.signatureLine} />
              <Text style={styles.signatureLabel}>{props.instructor}</Text>
              <Text style={styles.signatureLabel}>Workshop Instructor</Text>
            </View>
            <View style={styles.signature}>
              <View style={styles.signatureLine} />
              <Text style={styles.signatureLabel}>Neelakar Creative House</Text>
              <Text style={styles.signatureLabel}>Founder</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  )
}
