  const analyzeHourlyPatterns = async () => {
    try {
      const tasksRef = collection(firestore, 'tasks');
      const q = query(tasksRef, where('userId', '==', auth.currentUser.uid));
      const querySnapshot = await getDocs(q);
      
      console.log('Number of tasks found:', querySnapshot.size); // Debug log
      
      const hourlyStats = {};
      let totalHigh = 0;
      
      // Initialize hourly slots (0-23)
      for (let i = 0; i < 24; i++) {
        hourlyStats[i] = {
          high: 0,
          medium: 0,
          low: 0
        };
      }

      querySnapshot.forEach((doc) => {
        const task = doc.data();
        console.log('Processing task:', task); // Debug log
        
        if (task.completed && task.startTime && task.duration) {
          // Convert Firebase Timestamp to Date
          const startTime = task.startTime.toDate();
          const hour = startTime.getHours();
          const impact = task.leverage?.toLowerCase() || 'low';
          
          console.log('Task details:', { // Debug log
            hour,
            impact,
            duration: task.duration
          });
          
          hourlyStats[hour][impact] += task.duration;

          if (impact === 'high') {
            totalHigh += task.duration;
          }
        }
      });

      console.log('Final hourlyStats:', hourlyStats); // Debug log

      setHourlyData(hourlyStats);
      setMostProductiveHour(mostProductiveHr);
      setTotalHighImpactTime(totalHigh);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };
