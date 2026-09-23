export function ImpressumPage() {
  return (
    <div className="container section">
      <div className="glass-card-static" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 className="heading-2">Impressum</h1>
        <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <p>
            <strong>Angaben gemäß § 5 TMG</strong><br />
            SchildWerk GmbH<br />
            Musterstraße 123<br />
            10115 Berlin
          </p>
          <p>
            <strong>Vertreten durch:</strong><br />
            Max Mustermann
          </p>
          <p>
            <strong>Kontakt:</strong><br />
            Telefon: +49 (0) 30 12345678<br />
            E-Mail: info@schildwerk.de
          </p>
          <p>
            <strong>Registereintrag:</strong><br />
            Eintragung im Handelsregister.<br />
            Registergericht: Amtsgericht Berlin (Charlottenburg)<br />
            Registernummer: HRB 123456
          </p>
          <p>
            <strong>Umsatzsteuer-ID:</strong><br />
            Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:<br />
            DE 123456789
          </p>
          <p className="text-secondary" style={{ marginTop: '24px', fontSize: '0.9rem' }}>
            Dieses Impressum ist ein Platzhalter für den MVP.
          </p>
        </div>
      </div>
    </div>
  );
}

export function DatenschutzPage() {
  return (
    <div className="container section">
      <div className="glass-card-static" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 className="heading-2">Datenschutzerklärung</h1>
        <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 className="heading-3">1. Datenschutz auf einen Blick</h2>
          <p>
            <strong>Allgemeine Hinweise</strong><br />
            Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen.
          </p>
          <h2 className="heading-3">2. Datenerfassung auf dieser Website</h2>
          <p>
            <strong>Wer ist verantwortlich für die Datenerfassung auf dieser Website?</strong><br />
            Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten können Sie dem Impressum dieser Website entnehmen.
          </p>
          <p>
            <strong>Wie erfassen wir Ihre Daten?</strong><br />
            Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei kann es sich z.B. um Daten handeln, die Sie in ein Kontaktformular oder bei der Bestellung im Checkout eingeben.
          </p>
          <p className="text-secondary" style={{ marginTop: '24px', fontSize: '0.9rem' }}>
            Dies ist ein Platzhalter für den MVP. Eine vollständige Datenschutzerklärung muss vor Livegang hinterlegt werden.
          </p>
        </div>
      </div>
    </div>
  );
}
