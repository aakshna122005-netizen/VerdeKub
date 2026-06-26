import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest

class MLDetector:
    def __init__(self):
        # Default settings
        self.contamination = 0.15
        self.leakage_cpu_threshold = 15.0
        self.model = IsolationForest(contamination=self.contamination, random_state=42)
        self._is_trained = False
        self._initialize_deterministic_training()

    def _initialize_deterministic_training(self):
        """Pre-train the model with static deterministic typical container metrics.
        This completely avoids using random/mock number generators.
        """
        # Create a static grid of typical container states (20 data points)
        # CPU values: 25%, 35%, 45%, 55%, 65%, 75%
        # Memory values: 40%, 50%, 60%, 70%, 80%
        # Carbon values: CPU * 0.42
        static_data = []
        for cpu in [25.0, 30.0, 35.0, 40.0, 45.0, 50.0, 55.0, 60.0, 65.0, 70.0, 75.0, 80.0]:
            for mem in [40.0, 50.0, 60.0, 70.0, 80.0]:
                carbon = cpu * 0.42
                static_data.append([cpu, mem, carbon])

        X_train = np.array(static_data)
        self.model.fit(X_train)
        self._is_trained = True

    def train_on_history(self, metrics_history):
        """Train the model dynamically on actual database history.
        metrics_history is expected to be a list of dicts/tuples or a DataFrame
        with keys/columns: cpu_usage, memory_usage, carbon_output
        """
        if len(metrics_history) < 10:
            return
        
        df = pd.DataFrame(metrics_history)
        X = df[['cpu_usage', 'memory_usage', 'carbon_output']].values
        self.model.fit(X)
        self._is_trained = True

    def update_settings(self, contamination: float, leakage_cpu_threshold: float):
        """Update model hyperparameters and refit the model."""
        self.contamination = contamination
        self.leakage_cpu_threshold = leakage_cpu_threshold
        self.model = IsolationForest(contamination=self.contamination, random_state=42)
        self._initialize_deterministic_training()

    def detect(self, cpu: float, memory: float, carbon: float) -> str:
        """Classify a single metric footprint.
        Returns:
            "Normal" or "Leakage"
        """
        # Base Rule override: Any CPU utilization under threshold is leakage
        if cpu < self.leakage_cpu_threshold:
            return "Leakage"

        if not self._is_trained:
            return "Normal"

        try:
            X = np.array([[cpu, memory, carbon]])
            prediction = self.model.predict(X)
            # -1 indicates anomaly in Isolation Forest
            if prediction[0] == -1:
                return "Leakage"
            return "Normal"
        except Exception:
            return "Normal"

# Instantiate a global instance of MLDetector
detector = MLDetector()

