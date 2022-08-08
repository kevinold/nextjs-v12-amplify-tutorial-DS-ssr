export function getStaticProps() {
  console.log("[Next.js] Running getStaticProps");
  return {
    props: {
      time: new Date().toISOString(),
    },
    revalidate: 1,
  };
}

export default function ISR({ time }) {
  return <h1>{time}</h1>;
}
