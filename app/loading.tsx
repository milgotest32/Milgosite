export default function Loading() {
  return (
    <div style={{
      minHeight: '60vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Nunito, sans-serif', gap: '16px'
    }}>
      <div style={{
        width: '44px', height: '44px', borderRadius: '50%',
        border: '3px solid #F0ECF5',
        borderTop: '3px solid #E8567A',
        animation: 'spin 0.8s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <p style={{ fontSize: '14px', color: '#9CA3AF', margin: 0 }}>Yükleniyor…</p>
    </div>
  )
}
