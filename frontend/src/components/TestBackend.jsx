import { useAuth } from "@clerk/clerk-react";

export const TestBackend = () => {
  const { getToken } = useAuth();

  const callApi = async () => {
    try {
      const token = await getToken();

      const response = await fetch('http://localhost:3000/api/v1/test-sync', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      console.log("Réponse du serveur :", data);
    } catch (err) {
      console.error("Erreur :", err);
    }
  };

  return <button onClick={callApi}>Tester la Synchro</button>;
};
