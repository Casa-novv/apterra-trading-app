import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  TextField,
  Button,
  Divider,
  Alert,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
} from '@mui/material';
import {
  Person,
  Notifications,
  Security,
  Palette,
  TrendingUp,
  Save,
} from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../hooks/redux';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const Settings: React.FC = () => {
  const dispatch = useAppDispatch();
  // If you have a RootState type exported from your store, use it here:
    const { user } = useAppSelector((state: any) => state.auth);
  // Replace 'any' with 'RootState' if available, e.g.:
  // import { RootState } from '../store';
  // const { user } = useAppSelector((state: RootState) => state.auth);
  
  const [activeTab, setActiveTab] = useState(0);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Profile settings
  const [profileSettings, setProfileSettings] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    timezone: 'UTC',
    language: 'en',
  });

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    signalAlerts: true,
    portfolioUpdates: true,
    marketNews: false,
    weeklyReports: true,
  });

  // Trading settings
  const [tradingSettings, setTradingSettings] = useState({
    riskLevel: 'medium',
    maxPositions: 10,
    stopLossPercentage: 5,
    takeProfitPercentage: 10,
    autoTrading: false,
    signalConfidenceThreshold: 75,
  });

  // Security settings
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    loginNotifications: true,
    sessionTimeout: 30,
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleSave = () => {
    // Here you would dispatch actions to save the settings
    console.log('Saving settings:', {
      profile: profileSettings,
      notifications: notificationSettings,
      trading: tradingSettings,
      security: securitySettings,
    });
    
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box mb={4}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Settings
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Customize your APTERRA experience
        </Typography>
      </Box>

      {saveSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Settings saved successfully!
        </Alert>
      )}

      <Paper 
        sx={{ 
          background: 'rgba(26, 26, 46, 0.8)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange}
            sx={{
              '& .MuiTab-root': {
                color: 'text.secondary',
                '&.Mui-selected': {
                  color: '#00d4aa',
                },
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#00d4aa',
              },
            }}
          >
            <Tab icon={<Person />} label="Profile" />
            <Tab icon={<Notifications />} label="Notifications" />
            <Tab icon={<TrendingUp />} label="Trading" />
            <Tab icon={<Security />} label="Security" />
          </Tabs>
        </Box>

        {/* Profile Settings */}
        <TabPanel value={activeTab} index={0}>
          <Typography variant="h5" gutterBottom sx={{ color: '#00d4aa' }}>
            Profile Information
          </Typography>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Full Name"
                value={profileSettings.name}
                onChange={(e) => setProfileSettings(prev => ({ ...prev, name: e.target.value }))}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={profileSettings.email}
                onChange={(e) => setProfileSettings(prev => ({ ...prev, email: e.target.value }))}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Phone Number"
                value={profileSettings.phone}
                onChange={(e) => setProfileSettings(prev => ({ ...prev, phone: e.target.value }))}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Timezone</InputLabel>
                <Select
                  value={profileSettings.timezone}
                  label="Timezone"
                  onChange={(e) => setProfileSettings(prev => ({ ...prev, timezone: e.target.value }))}
                >
                  <MenuItem value="UTC">UTC</MenuItem>
                  <MenuItem value="EST">Eastern Time</MenuItem>
                  <MenuItem value="PST">Pacific Time</MenuItem>
                  <MenuItem value="GMT">Greenwich Mean Time</MenuItem>
                  <MenuItem value="CET">Central European Time</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Language</InputLabel>
                <Select
                  value={profileSettings.language}
                  label="Language"
                  onChange={(e) => setProfileSettings(prev => ({ ...prev, language: e.target.value }))}
                >
                  <MenuItem value="en">English</MenuItem>
                  <MenuItem value="es">Spanish</MenuItem>
                  <MenuItem value="fr">French</MenuItem>
                  <MenuItem value="de">German</MenuItem>
                  <MenuItem value="zh">Chinese</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Notification Settings */}
        <TabPanel value={activeTab} index={1}>
          <Typography variant="h5" gutterBottom sx={{ color: '#00d4aa' }}>
            Notification Preferences
          </Typography>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <Card sx={{ background: 'rgba(255, 255, 255, 0.05)' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    General Notifications
                  </Typography>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notificationSettings.emailNotifications}
                        onChange={(e) => setNotificationSettings(prev => ({ 
                          ...prev, 
                          emailNotifications: e.target.checked 
                        }))}
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': {
                            color: '#00d4aa',
                          },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                            backgroundColor: '#00d4aa',
                          },
                        }}
                      />
                    }
                    label="Email Notifications"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notificationSettings.pushNotifications}
                        onChange={(e) => setNotificationSettings(prev => ({ 
                          ...prev, 
                          pushNotifications: e.target.checked 
                        }))}
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': {
                            color: '#00d4aa',
                          },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                            backgroundColor: '#00d4aa',
                          },
                        }}
                      />
                    }
                    label="Push Notifications"
                  />
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Card sx={{ background: 'rgba(255, 255, 255, 0.05)' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Trading Notifications
                  </Typography>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notificationSettings.signalAlerts}
                        onChange={(e) => setNotificationSettings(prev => ({ 
                          ...prev, 
                          signalAlerts: e.target.checked 
                        }))}
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': {
                            color: '#00d4aa',
                          },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                            backgroundColor: '#00d4aa',
                          },
                        }}
                      />
                    }
                    label="Signal Alerts"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notificationSettings.portfolioUpdates}
                        onChange={(e) => setNotificationSettings(prev => ({ 
                          ...prev, 
                          portfolioUpdates: e.target.checked 
                        }))}
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': {
                            color: '#00d4aa',
                          },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                            backgroundColor: '#00d4aa',
                          },
                        }}
                      />
                    }
                    label="Portfolio Updates"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notificationSettings.marketNews}
                        onChange={(e) => setNotificationSettings(prev => ({ 
                          ...prev, 
                          marketNews: e.target.checked 
                        }))}
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': {
                            color: '#00d4aa',
                          },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                            backgroundColor: '#00d4aa',
                          },
                        }}
                      />
                    }
                    label="Market News"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notificationSettings.weeklyReports}
                        onChange={(e) => setNotificationSettings(prev => ({ 
                          ...prev, 
                          weeklyReports: e.target.checked 
                        }))}
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': {
                            color: '#00d4aa',
                          },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                            backgroundColor: '#00d4aa',
                          },
                        }}
                      />
                    }
                    label="Weekly Reports"
                  />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Trading Settings */}
        <TabPanel value={activeTab} index={2}>
          <Typography variant="h5" gutterBottom sx={{ color: '#00d4aa' }}>
            Trading Preferences
          </Typography>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Risk Level</InputLabel>
                <Select
                  value={tradingSettings.riskLevel}
                  label="Risk Level"
                  onChange={(e) => setTradingSettings(prev => ({ ...prev, riskLevel: e.target.value }))}
                >
                  <MenuItem value="low">Conservative</MenuItem>
                  <MenuItem value="medium">Moderate</MenuItem>
                  <MenuItem value="high">Aggressive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Maximum Open Positions"
                type="number"
                value={tradingSettings.maxPositions}
                onChange={(e) => setTradingSettings(prev => ({ 
                  ...prev, 
                  maxPositions: parseInt(e.target.value) || 0 
                }))}
                inputProps={{ min: 1, max: 50 }}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Typography gutterBottom>
                Default Stop Loss Percentage: {tradingSettings.stopLossPercentage}%
              </Typography>
              <Slider
                value={tradingSettings.stopLossPercentage}
                onChange={(e, value) => setTradingSettings(prev => ({ 
                  ...prev, 
                  stopLossPercentage: value as number 
                }))}
                min={1}
                max={20}
                step={0.5}
                marks
                valueLabelDisplay="auto"
                sx={{
                  color: '#00d4aa',
                  '& .MuiSlider-thumb': {
                    backgroundColor: '#00d4aa',
                  },
                  '& .MuiSlider-track': {
                    backgroundColor: '#00d4aa',
                  },
                  '& .MuiSlider-rail': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Typography gutterBottom>
                Default Take Profit Percentage: {tradingSettings.takeProfitPercentage}%
              </Typography>
              <Slider
                value={tradingSettings.takeProfitPercentage}
                onChange={(e, value) => setTradingSettings(prev => ({ 
                  ...prev, 
                  takeProfitPercentage: value as number 
                }))}
                min={5}
                max={50}
                step={1}
                marks
                valueLabelDisplay="auto"
                sx={{
                  color: '#00d4aa',
                  '& .MuiSlider-thumb': {
                    backgroundColor: '#00d4aa',
                  },
                  '& .MuiSlider-track': {
                    backgroundColor: '#00d4aa',
                  },
                  '& .MuiSlider-rail': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Typography gutterBottom>
                Signal Confidence Threshold: {tradingSettings.signalConfidenceThreshold}%
              </Typography>
              <Slider
                value={tradingSettings.signalConfidenceThreshold}
                onChange={(e, value) => setTradingSettings(prev => ({ 
                  ...prev, 
                  signalConfidenceThreshold: value as number 
                }))}
                min={50}
                max={95}
                step={5}
                marks
                valueLabelDisplay="auto"
                sx={{
                  color: '#00d4aa',
                  '& .MuiSlider-thumb': {
                    backgroundColor: '#00d4aa',
                  },
                  '& .MuiSlider-track': {
                    backgroundColor: '#00d4aa',
                  },
                  '& .MuiSlider-rail': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Card sx={{ background: 'rgba(255, 255, 255, 0.05)' }}>
                <CardContent>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={tradingSettings.autoTrading}
                        onChange={(e) => setTradingSettings(prev => ({ 
                          ...prev, 
                          autoTrading: e.target.checked 
                        }))}
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': {
                            color: '#00d4aa',
                          },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                            backgroundColor: '#00d4aa',
                          },
                        }}
                      />
                    }
                    label="Enable Auto Trading"
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Automatically execute trades based on AI signals that meet your criteria
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Security Settings */}
        <TabPanel value={activeTab} index={3}>
          <Typography variant="h5" gutterBottom sx={{ color: '#00d4aa' }}>
            Security & Privacy
          </Typography>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <Card sx={{ background: 'rgba(255, 255, 255, 0.05)' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Account Security
                  </Typography>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={securitySettings.twoFactorAuth}
                        onChange={(e) => setSecuritySettings(prev => ({ 
                          ...prev, 
                          twoFactorAuth: e.target.checked 
                        }))}
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': {
                            color: '#00d4aa',
                          },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                            backgroundColor: '#00d4aa',
                          },
                        }}
                      />
                    }
                    label="Two-Factor Authentication"
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mt: -1 }}>
                    Add an extra layer of security to your account
                  </Typography>
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={securitySettings.loginNotifications}
                        onChange={(e) => setSecuritySettings(prev => ({ 
                          ...prev, 
                          loginNotifications: e.target.checked 
                        }))}
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': {
                            color: '#00d4aa',
                          },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                            backgroundColor: '#00d4aa',
                          },
                        }}
                      />
                    }
                    label="Login Notifications"
                    sx={{ mt: 2 }}
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mt: -1 }}>
                    Get notified when someone logs into your account
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Session Timeout (minutes)</InputLabel>
                <Select
                  value={securitySettings.sessionTimeout}
                  label="Session Timeout (minutes)"
                  onChange={(e) => setSecuritySettings(prev => ({ 
                    ...prev, 
                    sessionTimeout: e.target.value as number 
                  }))}
                >
                  <MenuItem value={15}>15 minutes</MenuItem>
                  <MenuItem value={30}>30 minutes</MenuItem>
                  <MenuItem value={60}>1 hour</MenuItem>
                  <MenuItem value={120}>2 hours</MenuItem>
                  <MenuItem value={480}>8 hours</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom color="error">
                Danger Zone
              </Typography>
              <Card sx={{ background: 'rgba(244, 67, 54, 0.1)', border: '1px solid rgba(244, 67, 54, 0.3)' }}>
                <CardContent>
                  <Typography variant="body1" gutterBottom>
                    Delete Account
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Once you delete your account, there is no going back. Please be certain.
                  </Typography>
                  <Button 
                    variant="outlined" 
                    color="error"
                    onClick={() => {
                      // Handle account deletion
                      console.log('Delete account requested');
                    }}
                  >
                    Delete Account
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Save Button */}
        <Box sx={{ p: 3, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={handleSave}
            size="large"
            sx={{
              background: 'linear-gradient(45deg, #00d4aa 30%, #00a085 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #00a085 30%, #008066 90%)',
              }
            }}
          >
            Save Settings
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Settings;
export {};