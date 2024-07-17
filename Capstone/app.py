import streamlit as st
import pandas as pd
import joblib

# Load the pre-trained model
rm_price_model = joblib.load('regressornew.pkl')

# Exact features after encoding
feature_names = [
    'Thick/Dia', 'Width', 'Length', 'Weight in Kgs', 'Price/Kilo',
    'Material_Al-Br', 'Material_Alloy St.', 'Material_Alu', 'Material_Cu-Ti-Ni', 'Material_Forging',
    'Material_Ni', 'Material_Steel', 'Material_Ti',
    'Type_Flat Bar', 'Type_Plate', 'Type_Round', 'Type_Tube',
    'Temp_F4', 'Temp_H1000', 'Temp_H1025', 'Temp_Norm', 'Temp_P', 'Temp_Sol. Treat', 'Temp_T3',
    'Temp_T35', 'Temp_T351', 'Temp_T3511', 'Temp_T4', 'Temp_T6', 'Temp_T651', 'Temp_T6511',
    'Temp_T7351', 'Temp_T73511', 'Temp_T74', 'Temp_T7451', 'Temp_T76511', 'Temp_T77511',
    'Temp_T851', 'Temp_TH04',
    'Spec_ABS5052', 'Spec_ABS5073A', 'Spec_ABS5324', 'Spec_ABS5455', 'Spec_AMS WW T700/3',
    'Spec_AMS4027', 'Spec_AMS4050', 'Spec_AMS4078', 'Spec_AMS4082', 'Spec_AMS4117',
    'Spec_AMS4124', 'Spec_AMS4342', 'Spec_AMS4534', 'Spec_AMS4596', 'Spec_AMS4640',
    'Spec_AMS4880', 'Spec_AMS4911', 'Spec_AMS4928', 'Spec_AMS5599', 'Spec_AMS5622',
    'Spec_AMS5629', 'Spec_AMS5630', 'Spec_AMS5639', 'Spec_AMS5640', 'Spec_AMS5643',
    'Spec_AMS5659', 'Spec_AMS5848C', 'Spec_AMS6345', 'Spec_AMS6346', 'Spec_AMS6348',
    'Spec_AMS6360', 'Spec_ASNA3406', 'Spec_ASTM A240', 'Spec_ASTM A582', 'Spec_ASTM B209',
    'Spec_ASTM B211', 'Spec_ASTM B221', 'Spec_ASTM B221 ', 'Spec_ASTM D6778',
    'Spec_BAC1501-100153', 'Spec_BMS 7-122', 'Spec_BMS 7-214', 'Spec_BMS 7-240',
    'Spec_BMS 7-323', 'Spec_BMS7-371', 'Spec_EN573-3', 'Spec_MIL-T-9047', 'Spec_QQA200/11',
    'Spec_QQA200/3', 'Spec_QQA200/8', 'Spec_QQA225/6', 'Spec_QQA225/8', 'Spec_QQA225/9',
    'Spec_QQA250/11A', 'Spec_QQA250/12', 'Spec_QQA250/30', 'Spec_QQA250/4', 'Spec_QQA250/5',
    'Alloy_15-5PH', 'Alloy_17-4PH', 'Alloy_2024', 'Alloy_2219', 'Alloy_300', 'Alloy_302 CRES',
    'Alloy_303 CRES', 'Alloy_4130', 'Alloy_4330M', 'Alloy_440C', 'Alloy_6061', 'Alloy_625',
    'Alloy_6AL-4V', 'Alloy_7040', 'Alloy_7050', 'Alloy_7055', 'Alloy_7075', 'Alloy_7136',
    'Alloy_7150', 'Alloy_7175', 'Alloy_7475', 'Alloy_Acetal', 'Alloy_Al-Br', 'Alloy_C17200 ',
    'Alloy_C63000', 'Alloy_CRES 304', 'Alloy_Cu-Ti-Ni', 'Alloy_NITRONIC 60', 'Alloy_TI6AL4V'
]

# Title of the app
st.title("RM Price Prediction App")

# Input fields
thick_dia = st.number_input("Thick/Dia (in inches)", min_value=0.0, step=0.01)
width = st.number_input("Width (in inches)", min_value=0.0, step=0.01)
length = st.number_input("Length (in inches)", min_value=0.0, step=0.01)
weight_kgs = st.number_input("Weight in Kgs", min_value=0.0, step=0.01)
price_kilo = st.number_input("Price/Kilo (in dollars)", min_value=0.0, step=0.01)

# Categorical features with options
material_options = ['Al-Br', 'Alloy St.', 'Alu', 'Cu-Ti-Ni', 'Forging', 'Ni', 'Steel', 'Ti']
type_options = ['Flat Bar', 'Plate', 'Round', 'Tube']
temp_options = ['F4', 'H1000', 'H1025', 'Norm', 'P', 'Sol. Treat', 'T3', 'T35', 'T351', 'T3511',
                'T4', 'T6', 'T651', 'T6511', 'T7351', 'T73511', 'T74', 'T7451', 'T76511', 'T77511',
                'T851', 'TH04']
spec_options = ['ABS5052', 'ABS5073A', 'ABS5324', 'ABS5455', 'AMS WW T700/3', 'AMS4027', 'AMS4050',
                'AMS4078', 'AMS4082', 'AMS4117', 'AMS4124', 'AMS4342', 'AMS4534', 'AMS4596', 'AMS4640',
                'AMS4880', 'AMS4911', 'AMS4928', 'AMS5599', 'AMS5622', 'AMS5629', 'AMS5630', 'AMS5639',
                'AMS5640', 'AMS5643', 'AMS5659', 'AMS5848C', 'AMS6345', 'AMS6346', 'AMS6348', 'AMS6360',
                'ASNA3406', 'ASTM A240', 'ASTM A582', 'ASTM B209', 'ASTM B211', 'ASTM B221', 'ASTM B221 ',
                'ASTM D6778', 'BAC1501-100153', 'BMS 7-122', 'BMS 7-214', 'BMS 7-240', 'BMS 7-323',
                'BMS7-371', 'EN573-3', 'MIL-T-9047', 'QQA200/11', 'QQA200/3', 'QQA200/8', 'QQA225/6',
                'QQA225/8', 'QQA225/9', 'QQA250/11A', 'QQA250/12', 'QQA250/30', 'QQA250/4', 'QQA250/5']
alloy_options = ['15-5PH', '17-4PH', '2024', '2219', '300', '302 CRES', '303 CRES', '4130', '4330M',
                 '440C', '6061', '625', '6AL-4V', '7040', '7050', '7055', '7075', '7136', '7150', '7175',
                 '7475', 'Acetal', 'Al-Br', 'C17200 ', 'C63000', 'CRES 304', 'Cu-Ti-Ni', 'NITRONIC 60',
                 'TI6AL4V']

# Dropdown selection boxes
material = st.selectbox("Material", material_options)
type_ = st.selectbox("Type", type_options)
temp = st.selectbox("Temp", temp_options)
spec = st.selectbox("Spec", spec_options)
alloy = st.selectbox("Alloy", alloy_options)

# Map dropdown selections to encoded feature names
material_feature = f"Material_{material}"
type_feature = f"Type_{type_}"
temp_feature = f"Temp_{temp}"
spec_feature = f"Spec_{spec}"
alloy_feature = f"Alloy_{alloy}"

# Prepare input data dictionary with exact feature names
input_data = {
    'Thick/Dia': thick_dia, 'Width': width, 'Length': length,
    'Weight in Kgs': weight_kgs, 'Price/Kilo': price_kilo,
    'Material_Al-Br': 1 if material_feature == 'Material_Al-Br' else 0,
    'Material_Alloy St.': 1 if material_feature == 'Material_Alloy St.' else 0,
    'Material_Alu': 1 if material_feature == 'Material_Alu' else 0,
    'Material_Cu-Ti-Ni': 1 if material_feature == 'Material_Cu-Ti-Ni' else 0,
    'Material_Forging': 1 if material_feature == 'Material_Forging' else 0,
    'Material_Ni': 1 if material_feature == 'Material_Ni' else 0,
    'Material_Steel': 1 if material_feature == 'Material_Steel' else 0,
    'Material_Ti': 1 if material_feature == 'Material_Ti' else 0,
    'Type_Flat Bar': 1 if type_feature == 'Type_Flat Bar' else 0,
    'Type_Plate': 1 if type_feature == 'Type_Plate' else 0,
    'Type_Round': 1 if type_feature == 'Type_Round' else 0,
    'Type_Tube': 1 if type_feature == 'Type_Tube' else 0,
    'Temp_F4': 1 if temp_feature == 'Temp_F4' else 0,
    'Temp_H1000': 1 if temp_feature == 'Temp_H1000' else 0,
    'Temp_H1025': 1 if temp_feature == 'Temp_H1025' else 0,
    'Temp_Norm': 1 if temp_feature == 'Temp_Norm' else 0,
    'Temp_P': 1 if temp_feature == 'Temp_P' else 0,
    'Temp_Sol. Treat': 1 if temp_feature == 'Temp_Sol. Treat' else 0,
    'Temp_T3': 1 if temp_feature == 'Temp_T3' else 0,
    'Temp_T35': 1 if temp_feature == 'Temp_T35' else 0,
    'Temp_T351': 1 if temp_feature == 'Temp_T351' else 0,
    'Temp_T3511': 1 if temp_feature == 'Temp_T3511' else 0,
    'Temp_T4': 1 if temp_feature == 'Temp_T4' else 0,
    'Temp_T6': 1 if temp_feature == 'Temp_T6' else 0,
    'Temp_T651': 1 if temp_feature == 'Temp_T651' else 0,
    'Temp_T6511': 1 if temp_feature == 'Temp_T6511' else 0,
    'Temp_T7351': 1 if temp_feature == 'Temp_T7351' else 0,
    'Temp_T73511': 1 if temp_feature == 'Temp_T73511' else 0,
    'Temp_T74': 1 if temp_feature == 'Temp_T74' else 0,
    'Temp_T7451': 1 if temp_feature == 'Temp_T7451' else 0,
    'Temp_T76511': 1 if temp_feature == 'Temp_T76511' else 0,
    'Temp_T77511': 1 if temp_feature == 'Temp_T77511' else 0,
    'Temp_T851': 1 if temp_feature == 'Temp_T851' else 0,
    'Temp_TH04': 1 if temp_feature == 'Temp_TH04' else 0,
    'Spec_ABS5052': 1 if spec_feature == 'Spec_ABS5052' else 0,
    'Spec_ABS5073A': 1 if spec_feature == 'Spec_ABS5073A' else 0,
    'Spec_ABS5324': 1 if spec_feature == 'Spec_ABS5324' else 0,
    'Spec_ABS5455': 1 if spec_feature == 'Spec_ABS5455' else 0,
    'Spec_AMS WW T700/3': 1 if spec_feature == 'Spec_AMS WW T700/3' else 0,
    'Spec_AMS4027': 1 if spec_feature == 'Spec_AMS4027' else 0,
    'Spec_AMS4050': 1 if spec_feature == 'Spec_AMS4050' else 0,
    'Spec_AMS4078': 1 if spec_feature == 'Spec_AMS4078' else 0,
    'Spec_AMS4082': 1 if spec_feature == 'Spec_AMS4082' else 0,
    'Spec_AMS4117': 1 if spec_feature == 'Spec_AMS4117' else 0,
    'Spec_AMS4124': 1 if spec_feature == 'Spec_AMS4124' else 0,
    'Spec_AMS4342': 1 if spec_feature == 'Spec_AMS4342' else 0,
    'Spec_AMS4534': 1 if spec_feature == 'Spec_AMS4534' else 0,
    'Spec_AMS4596': 1 if spec_feature == 'Spec_AMS4596' else 0,
    'Spec_AMS4640': 1 if spec_feature == 'Spec_AMS4640' else 0,
    'Spec_AMS4880': 1 if spec_feature == 'Spec_AMS4880' else 0,
    'Spec_AMS4911': 1 if spec_feature == 'Spec_AMS4911' else 0,
    'Spec_AMS4928': 1 if spec_feature == 'Spec_AMS4928' else 0,
    'Spec_AMS5599': 1 if spec_feature == 'Spec_AMS5599' else 0,
    'Spec_AMS5622': 1 if spec_feature == 'Spec_AMS5622' else 0,
    'Spec_AMS5629': 1 if spec_feature == 'Spec_AMS5629' else 0,
    'Spec_AMS5630': 1 if spec_feature == 'Spec_AMS5630' else 0,
    'Spec_AMS5639': 1 if spec_feature == 'Spec_AMS5639' else 0,
    'Spec_AMS5640': 1 if spec_feature == 'Spec_AMS5640' else 0,
    'Spec_AMS5643': 1 if spec_feature == 'Spec_AMS5643' else 0,
    'Spec_AMS5659': 1 if spec_feature == 'Spec_AMS5659' else 0,
    'Spec_AMS5848C': 1 if spec_feature == 'Spec_AMS5848C' else 0,
    'Spec_AMS6345': 1 if spec_feature == 'Spec_AMS6345' else 0,
    'Spec_AMS6346': 1 if spec_feature == 'Spec_AMS6346' else 0,
    'Spec_AMS6348': 1 if spec_feature == 'Spec_AMS6348' else 0,
    'Spec_AMS6360': 1 if spec_feature == 'Spec_AMS6360' else 0,
    'Spec_ASNA3406': 1 if spec_feature == 'Spec_ASNA3406' else 0,
    'Spec_ASTM A240': 1 if spec_feature == 'Spec_ASTM A240' else 0,
    'Spec_ASTM A582': 1 if spec_feature == 'Spec_ASTM A582' else 0,
    'Spec_ASTM B209': 1 if spec_feature == 'Spec_ASTM B209' else 0,
    'Spec_ASTM B211': 1 if spec_feature == 'Spec_ASTM B211' else 0,
    'Spec_ASTM B221': 1 if spec_feature == 'Spec_ASTM B221' else 0,
    'Spec_ASTM B221 ': 1 if spec_feature == 'Spec_ASTM B221 ' else 0,
    'Spec_ASTM D6778': 1 if spec_feature == 'Spec_ASTM D6778' else 0,
    'Spec_BAC1501-100153': 1 if spec_feature == 'Spec_BAC1501-100153' else 0,
    'Spec_BMS 7-122': 1 if spec_feature == 'Spec_BMS 7-122' else 0,
    'Spec_BMS 7-214': 1 if spec_feature == 'Spec_BMS 7-214' else 0,
    'Spec_BMS 7-240': 1 if spec_feature == 'Spec_BMS 7-240' else 0,
    'Spec_BMS 7-323': 1 if spec_feature == 'Spec_BMS 7-323' else 0,
    'Spec_BMS7-371': 1 if spec_feature == 'Spec_BMS7-371' else 0,
    'Spec_EN573-3': 1 if spec_feature == 'Spec_EN573-3' else 0,
    'Spec_MIL-T-9047': 1 if spec_feature == 'Spec_MIL-T-9047' else 0,
    'Spec_QQA200/11': 1 if spec_feature == 'Spec_QQA200/11' else 0,
    'Spec_QQA200/3': 1 if spec_feature == 'Spec_QQA200/3' else 0,
    'Spec_QQA200/8': 1 if spec_feature == 'Spec_QQA200/8' else 0,
    'Spec_QQA225/6': 1 if spec_feature == 'Spec_QQA225/6' else 0,
    'Spec_QQA225/8': 1 if spec_feature == 'Spec_QQA225/8' else 0,
    'Spec_QQA225/9': 1 if spec_feature == 'Spec_QQA225/9' else 0,
    'Spec_QQA250/11A': 1 if spec_feature == 'Spec_QQA250/11A' else 0,
    'Spec_QQA250/12': 1 if spec_feature == 'Spec_QQA250/12' else 0,
    'Spec_QQA250/30': 1 if spec_feature == 'Spec_QQA250/30' else 0,
    'Spec_QQA250/4': 1 if spec_feature == 'Spec_QQA250/4' else 0,
    'Spec_QQA250/5': 1 if spec_feature == 'Spec_QQA250/5' else 0,
    'Alloy_15-5PH': 1 if alloy_feature == 'Alloy_15-5PH' else 0,
    'Alloy_17-4PH': 1 if alloy_feature == 'Alloy_17-4PH' else 0,
    'Alloy_2024': 1 if alloy_feature == 'Alloy_2024' else 0,
    'Alloy_2219': 1 if alloy_feature == 'Alloy_2219' else 0,
    'Alloy_300': 1 if alloy_feature == 'Alloy_300' else 0,
    'Alloy_302 CRES': 1 if alloy_feature == 'Alloy_302 CRES' else 0,
    'Alloy_303 CRES': 1 if alloy_feature == 'Alloy_303 CRES' else 0,
    'Alloy_4130': 1 if alloy_feature == 'Alloy_4130' else 0,
    'Alloy_4330M': 1 if alloy_feature == 'Alloy_4330M' else 0,
    'Alloy_440C': 1 if alloy_feature == 'Alloy_440C' else 0,
    'Alloy_6061': 1 if alloy_feature == 'Alloy_6061' else 0,
    'Alloy_625': 1 if alloy_feature == 'Alloy_625' else 0,
    'Alloy_6AL-4V': 1 if alloy_feature == 'Alloy_6AL-4V' else 0,
    'Alloy_7040': 1 if alloy_feature == 'Alloy_7040' else 0,
    'Alloy_7050': 1 if alloy_feature == 'Alloy_7050' else 0,
    'Alloy_7055': 1 if alloy_feature == 'Alloy_7055' else 0,
    'Alloy_7075': 1 if alloy_feature == 'Alloy_7075' else 0,
    'Alloy_7136': 1 if alloy_feature == 'Alloy_7136' else 0,
    'Alloy_7150': 1 if alloy_feature == 'Alloy_7150' else 0,
    'Alloy_7175': 1 if alloy_feature == 'Alloy_7175' else 0,
    'Alloy_7475': 1 if alloy_feature == 'Alloy_7475' else 0,
    'Alloy_Acetal': 1 if alloy_feature == 'Alloy_Acetal' else 0,
    'Alloy_Al-Br': 1 if alloy_feature == 'Alloy_Al-Br' else 0,
    'Alloy_C17200 ': 1 if alloy_feature == 'Alloy_C17200 ' else 0,
    'Alloy_C63000': 1 if alloy_feature == 'Alloy_C63000' else 0,
    'Alloy_CRES 304': 1 if alloy_feature == 'Alloy_CRES 304' else 0,
    'Alloy_Cu-Ti-Ni': 1 if alloy_feature == 'Alloy_Cu-Ti-Ni' else 0,
    'Alloy_NITRONIC 60': 1 if alloy_feature == 'Alloy_NITRONIC 60' else 0,
    'Alloy_TI6AL4V': 1 if alloy_feature == 'Alloy_TI6AL4V' else 0
}

# Predicting the price
if st.button("Predict RM Price"):
    input_df = pd.DataFrame([input_data], columns=feature_names)
    prediction = rm_price_model.predict(input_df)
    st.write(f"Predicted RM Price: ${prediction[0]:,.2f}")


