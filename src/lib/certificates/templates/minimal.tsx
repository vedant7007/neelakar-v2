import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import type { CertificateData } from '..'

const styles = StyleSheet.create({
  page: { backgroundColor: '#FAFAFA', padding: 80, justifyContent: 'center', alignItems: 'center' },
  topLine: { position: 'absolute', top: 50, left: 80, right: 80, height: 0.5, backgroundColor: '#141414' },
  bottomLine: { position: 'absolute', bottom: 50, left: 80, right: 80, height: 0.5, backgroundColor: '#141414' },
  content: { alignItems: 'center' },
  logo: { fontSize: 10, letterSpacing: 8, color: '#999', textTransform: 'uppercase', marginBottom: 50 },
  title: { fontSize: 11, letterSpacing: 6, color: '#999', textTransform: 'uppercase', marginBottom: 30 },
  name: { fontSize: 34, fontFamily: 'Helvetica-Bold', color: '#141414', marginBottom: 20 },
  divider: { width: 40, height: 0.5, backgroundColor: '#C9561E', marginBottom: 20 },
  body: { fontSize: 12, color: '#666', textAlign: 'center', lineHeight: 2, maxWidth: 360, marginBottom: 10 },
  workshop: { fontSize: 15, fontFamily: 'Helvetica-Bold', color: '#141414', marginBottom: 20 },
  details: { fontSize: 10, color: '#999', textAlign: 'center', lineHeight: 1.8, marginBottom: 30 },
  customLine: { fontSize: 11, color: '#C9561E', fontFamily: 'Helvetica-Oblique', marginBottom: 30 },
  signatureRow: { flexDirection: 'row', gap: 60, marginTop: 30 },
  signature: { alignItems: 'center' },
  signatureLine: { width: 100, height: 0.5, backgroundColor: '#ccc', marginBottom: 5 },
  signatureLabel: { fontSize: 8, color: '#999', letterSpacing: 1 },
})

export function MinimalTemplate(props: CertificateData) {
  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.topLine} />
        <View style={styles.bottomLine} />
        <View style={styles.content}>
          <Text style={styles.logo}>Neelakar</Text>
          <Text style={styles.title}>{props.title || 'Certificate of Completion'}</Text>
          <Text style={styles.name}>{props.participantName}</Text>
          <View style={styles.divider} />
          <Text style={styles.body}>{props.body || 'has successfully completed'}</Text>
          <Text style={styles.workshop}>{props.workshopTitle}</Text>
          <Text style={styles.details}>{props.dates} &bull; {props.location} &bull; {props.instructor}</Text>
          {props.customLine && <Text style={styles.customLine}>{props.customLine}</Text>}
          <View style={styles.signatureRow}>
            <View style={styles.signature}>
              <View style={styles.signatureLine} />
              <Text style={styles.signatureLabel}>Instructor</Text>
            </View>
            <View style={styles.signature}>
              <View style={styles.signatureLine} />
              <Text style={styles.signatureLabel}>Neelakar Creative House</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  )
}
