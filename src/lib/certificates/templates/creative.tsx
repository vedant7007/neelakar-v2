import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import type { CertificateData } from '..'

const styles = StyleSheet.create({
  page: { backgroundColor: '#F5F0E8', padding: 50, position: 'relative' },
  circle1: { position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: 100, backgroundColor: '#C9561E', opacity: 0.08 },
  circle2: { position: 'absolute', bottom: -30, left: -30, width: 150, height: 150, borderRadius: 75, backgroundColor: '#2C6E7F', opacity: 0.06 },
  circle3: { position: 'absolute', top: 100, left: -50, width: 100, height: 100, borderRadius: 50, backgroundColor: '#D4A84B', opacity: 0.05 },
  content: { paddingTop: 30, alignItems: 'center' },
  logo: { fontSize: 12, fontFamily: 'Helvetica-Bold', letterSpacing: 4, color: '#141414', marginBottom: 40 },
  titleWrap: { marginBottom: 30 },
  title: { fontSize: 28, fontFamily: 'Helvetica-Bold', color: '#C9561E', textAlign: 'center' },
  titleSub: { fontSize: 10, letterSpacing: 6, color: '#999', textTransform: 'uppercase', textAlign: 'center', marginTop: 8 },
  wave: { width: 60, height: 3, backgroundColor: '#C9561E', borderRadius: 2, marginBottom: 30 },
  name: { fontSize: 32, fontFamily: 'Helvetica-Bold', color: '#141414', marginBottom: 14 },
  body: { fontSize: 12, color: '#555', textAlign: 'center', lineHeight: 1.8, maxWidth: 380, marginBottom: 8 },
  workshop: { fontSize: 17, fontFamily: 'Helvetica-Bold', color: '#2C6E7F', marginBottom: 20 },
  details: { fontSize: 10, color: '#888', textAlign: 'center', lineHeight: 1.6, marginBottom: 24 },
  customLine: { fontSize: 11, color: '#C9561E', fontFamily: 'Helvetica-Oblique', marginBottom: 24 },
  signatureRow: { flexDirection: 'row', justifyContent: 'space-between', width: '70%', marginTop: 20 },
  signature: { alignItems: 'center' },
  signatureLine: { width: 110, height: 1, backgroundColor: '#C9561E', opacity: 0.4, marginBottom: 6 },
  signatureLabel: { fontSize: 9, color: '#888' },
})

export function CreativeTemplate(props: CertificateData) {
  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.circle1} />
        <View style={styles.circle2} />
        <View style={styles.circle3} />
        <View style={styles.content}>
          <Text style={styles.logo}>NEELAKAR CREATIVE HOUSE</Text>
          <View style={styles.titleWrap}>
            <Text style={styles.title}>{props.title || 'Certificate of Completion'}</Text>
            <Text style={styles.titleSub}>proudly presented to</Text>
          </View>
          <View style={styles.wave} />
          <Text style={styles.name}>{props.participantName}</Text>
          <Text style={styles.body}>{props.body || 'for the successful completion of'}</Text>
          <Text style={styles.workshop}>{props.workshopTitle}</Text>
          <Text style={styles.details}>{props.dates} &bull; {props.location}{'\n'}Led by {props.instructor}</Text>
          {props.customLine && <Text style={styles.customLine}>{props.customLine}</Text>}
          <View style={styles.signatureRow}>
            <View style={styles.signature}>
              <View style={styles.signatureLine} />
              <Text style={styles.signatureLabel}>{props.instructor}</Text>
            </View>
            <View style={styles.signature}>
              <View style={styles.signatureLine} />
              <Text style={styles.signatureLabel}>Founder</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  )
}
