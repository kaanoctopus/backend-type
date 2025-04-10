export const saveToBackupAPI = async (
    userId: string,
    expression: string,
    result: string
  ): Promise<void> => {
    try {
      const response = await fetch(
        "https://calcbackend.netlify.app/api/calculate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.AUTH_KEY}`,
          },
          body: JSON.stringify({ userId, expression, result }),
        }
      );
  
      if (!response.ok) {
        throw new Error(`Backup API responded with status: ${response.status}`);
      }
  
      console.log("Successfully saved to secondary API.");
    } catch (backupErr) {
      console.error("Backup API save failed:", backupErr);
    }
  };
  