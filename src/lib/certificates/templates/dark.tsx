import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import type { CertificateData } from '..'

const styles = StyleSheet.create({
  page: { backgroundColor: '#141414', padding: 60, position: 'relative' },
  goldLine: { position: 'absolute', top: 40, left: 40, right: 40, height: 0.5, backgroundColor: '#D4A84B', opacity: 0.5 },
  goldLineBottom: { position: 'absolute', bottom: 40, left: 40, right: 40, height: 0.5, backgroundColor: '#D4A84B', opacity: 0.5 },
  content: { alignItems: 'center', paddingTop: 30 },
  logo: { fontSize: 11, letterSpacing: 8, color: '#D4A84B', textTransform: 'uppercase', marginBottom: 50 },
  title: { fontSize: 30, fontFamily: 'Helvetica-Bold', color: '#F5F0E8', marginBottom: 6 },
  subtitle: { fontSize: 10, letterSpacing: 5, color: '#D4A84B', textTransform: 'uppercase', marginBottom: 40, opacity: 0.7 },
  name: { fontSize: 32, fontFamily: 'Helvetica-Bold', color: '#D4A84B', marginBottom: 16 },
  body: { fontSize: 12, color: '#999', textAlign: 'center', lineHeight: 1.8, maxWidth: 380, marginBottom: 10 },
  workshop: { fontSize: 17, fontFamily: 'Helvetica-Bold', color: '#F5F0E8', marginBottom: 24 },
  details: { fontSize: 10, color: '#666', textAlign: 'center', lineHeight: 1.6, marginBottom: 24 },
  customLine: { fontSize: 11, color: '#D4A84B', fontFamily: 'Helvetica-Oblique', marginBottom: 24 },
  divider: { width: 60, height: 1, backgroundColor: '#D4A84B', opacity: 0.3, marginBottom: 30 },
  signatureRow: { flexDirection: 'row', justifyContent: 'space-between', width: '75%', marginTop: 20 },
  signature: { alignItems: 'center' },
  signatureLine: { width: 120, height: 0.5, backgroundColor: '#D4A84B', opacity: 0.5, marginBottom: 6 },
  signatureLabel: { fontSize: 9, color: '#666' },
})

export function DarkTemplate(props: CertificateData) {
  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.goldLine} />
        <View style={styles.goldLineBottom} />
        <View style={styles.content}>
          <Text style={styles.logo}>Neelakar Creative House</Text>
          <Text style={styles.title}>{props.title || 'Certificate of Completion'}</Text>
          <Text style={styles.subtitle}>conferred upon</Text>
          <Text style={styles.name}>{props.participantName}</Text>
          <Text style={styles.body}>{props.body || 'in recognition of successful completion of'}</Text>
          <Text style={styles.workshop}>{props.workshopTitle}</Text>
          <Text style={styles.details}>{props.dates} &bull; {props.location}{'\n'}{props.instructor}</Text>
          {props.customLine && <Text style={styles.customLine}>{props.customLine}</Text>}
          <View style={styles.divider} />
          <View style={styles.signatureRow}>
            <View style={styles.signature}>
              <View style={styles.signatureLine} />
              <Text style={styles.signatureLabel}>{props.instructor}</Text>
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
