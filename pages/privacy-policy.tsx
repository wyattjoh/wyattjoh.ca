import Layout from "../components/Layout";

export default function PrivacyPolicyPage() {
  return (
    <Layout title="Privacy Policy">
      <div className="bg-pink-600 p-4 text-white space-y-8">
        <h1 className="font-bold text-6xl lowercase">Privacy Policy</h1>
        <p>
          Double Shot does not collect, store, or transmit any personal
          information.
        </p>
      </div>
    </Layout>
  );
}
