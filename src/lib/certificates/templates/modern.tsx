import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import type { CertificateData } from '..'

const styles = StyleSheet.create({
  page: { backgroundColor: '#FFFFFF', padding: 50, position: 'relative' },
  accentBar: { position: 'absolute', top: 0, left: 0, width: 8, height: '100%', backgroundColor: '#2C6E7F' },
  topAccent: { position: 'absolute', top: 0, right: 0, width: 200, height: 8, backgroundColor: '#C9561E' },
  content: { paddingLeft: 30, paddingTop: 20 },
  logo: { fontSize: 11, fontFamily: 'Helvetica-Bold', letterSpacing: 6, color: '#141414', textTransform: 'uppercase', marginBottom: 50 },
  title: { fontSize: 36, fontFamily: 'Helvetica-Bold', color: '#141414', marginBottom: 4 },
  titleAccent: { fontSize: 36, fontFamily: 'Helvetica-Bold', color: '#2C6E7F' },
  certLabel: { fontSize: 10, color: '#999', letterSpacing: 4, textTransform: 'uppercase', marginBottom: 40 },
  name: { fontSize: 30, fontFamily: 'Helvetica-Bold', color: '#C9561E', marginBottom: 12 },
  body: { fontSize: 12, color: '#555', lineHeight: 1.8, maxWidth: 400, marginBottom: 10 },
  workshop: { fontSize: 18, fontFamily: 'Helvetica-Bold', color: '#141414', marginBottom: 24 },
  detailRow: { flexDirection: 'row', gap: 30, marginBottom: 30 },
  detail: { fontSize: 9, color: '#999', letterSpacing: 1, textTransform: 'uppercase' },
  detailValue: { fontSize: 11, color: '#141414', fontFamily: 'Helvetica-Bold', marginTop: 3 },
  customLine: { fontSize: 11, color: '#2C6E7F', fontFamily: 'Helvetica-Oblique', marginBottom: 30 },
  bottomSection: { marginTop: 'auto', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  signature: { alignItems: 'flex-start' },
  signatureLine: { width: 140, height: 0.5, backgroundColor: '#141414', marginBottom: 5 },
  signatureLabel: { fontSize: 9, color: '#666' },
  geometric: { width: 60, height: 60, borderWidth: 2, borderColor: '#2C6E7F', transform: 'rotate(45deg)', opacity: 0.3 },
})

export function ModernTemplate(props: CertificateData) {
  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.accentBar} />
        <View style={styles.topAccent} />
        <View style={styles.content}>
          <Text style={styles.logo}>Neelakar Creative House</Text>
          <Text style={styles.certLabel}>Certificate of Completion</Text>
          <Text style={styles.title}>{props.title || 'Certificate'}</Text>
          <Text style={styles.certLabel}>awarded to</Text>
          <Text style={styles.name}>{props.participantName}</Text>
          <Text style={styles.body}>{props.body || 'for successfully completing the workshop'}</Text>
          <Text style={styles.workshop}>{props.workshopTitle}</Text>
          <View style={styles.detailRow}>
            <View>
              <Text style={styles.detail}>Date</Text>
              <Text style={styles.detailValue}>{props.dates}</Text>
            </View>
            <View>
              <Text style={styles.detail}>Location</Text>
              <Text style={styles.detailValue}>{props.location}</Text>
            </View>
            <View>
              <Text style={styles.detail}>Instructor</Text>
              <Text style={styles.detailValue}>{props.instructor}</Text>
            </View>
          </View>
          {props.customLine && <Text style={styles.customLine}>{props.customLine}</Text>}
          <View style={styles.bottomSection}>
            <View style={styles.signature}>
              <View style={styles.signatureLine} />
              <Text style={styles.signatureLabel}>{props.instructor} &bull; Instructor</Text>
            </View>
            <View style={styles.geometric} />
          </View>
        </View>
      </Page>
    </Document>
  )
}
