const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tunai_user', {
    uid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    upassword: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    userid: {
      type: DataTypes.STRING(40),
      allowNull: true,
      comment: "Identity Card No"
    },
    utype: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "0=individual,1=company,2=personal loan, 3=karyawn"
    },
    ufullname: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    uphone: {
      type: DataTypes.STRING(40),
      allowNull: false
    },
    uhandphone: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    uemail: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    ugender: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "0 M 1 F"
    },
    udob: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    upob: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    ustatus: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "0 Inactive, 1 Active,2 Pending"
    },
    uverify: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "0=no,1=verified"
    },
    ubankname: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    ubankowner: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    ubankacc: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    ucitizen: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "Warganegara"
    },
    unpwp: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    ucompany: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    ucompanynpwp: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    ucompanyprovince: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    ucompanycity: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    ucompanydistrict: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    ucompanyarea: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    ucompanyaddress: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    ucompanypostcode: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    ucompanyphone: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    ucompanyemail: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    ucompanyposition: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    ucompanyrevenue: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    usalary: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "personal income"
    },
    umarry: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "0 single,1 married,2 divorce hidup, 3 cerai mati"
    },
    uchildnumber: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    ueducation: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    uresidenceduration: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    uaddress1: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Full Address"
    },
    uaddress2: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Province"
    },
    uaddress3: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "City(Kota)"
    },
    uaddress4: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "District (Kecematan)"
    },
    uaddress5: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Area (Jalan)"
    },
    upostcode: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    uimg1: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "ID \/ KTP"
    },
    uimg2: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Profile Photo \/ Selfie KTP"
    },
    uimg3: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Bank"
    },
    uimg4: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "SalarySlip"
    },
    uemergency: {
      type: DataTypes.STRING(40),
      allowNull: true
    },
    uemergency2: {
      type: DataTypes.STRING(40),
      allowNull: true
    },
    uename: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "emergency name 1"
    },
    uename2: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "emergency name 2"
    },
    uerelationship: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "for emergency 1"
    },
    uerelationship2: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "for emergency 2"
    },
    uestatus: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    ueaction_datetime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    ucreatedate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    instamoney_id: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    otptoken: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    umaidenname: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    urefidemployee: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "ID Employee Referensi"
    },
    urefcompanyname: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "Company Name Referesnsi"
    },
    digisignStatus: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "0=inactive, 1=active"
    },
    digisignActivate: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "verificationLink"
    },
    digisignRegisterDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    digisignActivateDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    digisignMessage: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    digisignId: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "Id Privy"
    },
    jenis_pekerjaan: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    ujobyear: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    ucompanyfisik: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    ucompanybuild: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    ujobsector: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    uimg5: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    uimg6: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    liveness: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    umothername: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    unpwpno: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    alamat_domisili_sesuai_ktp: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    jalan_domisili: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    provinsi_domisili: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    kota_domisili: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    kecamatan_domisili: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    kelurahan_domisili: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    kodepos_domisili: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    valid_ocr: {
      type: DataTypes.STRING(5),
      allowNull: true
    },
    message_ocr: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    facecomparison_similarity: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    message_facecomparison: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    username: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    utoken: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    sms_verify_status: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "0=Unverify, 1=Verified"
    },
    sms_verify_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    valid_identitycheck: {
      type: DataTypes.STRING(5),
      allowNull: true,
      comment: "1 = true, 0 false"
    },
    message_identitycheck: {
      type: DataTypes.STRING(300),
      allowNull: true
    },
    transactionid_identitycheck: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    data_identitycheck: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    flag_blacklist: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "1 = true, 0 = false"
    },
    flag_risklist: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "1 = true, 0 = false"
    },
    flag_riskyface: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "1 = true, 0 = false"
    },
    urefemployeestart: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    urefemployeestatus: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    urefcompanyposition: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    ureligion: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    upaylaterva: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    is_company: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    blocked_status: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "0 = account not blocked"
    }
  }, {
    sequelize,
    tableName: 'tunai_user',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "uid" },
        ]
      },
      {
        name: "uphone",
        using: "BTREE",
        fields: [
          { name: "uphone" },
        ]
      },
      {
        name: "ucreatedate",
        using: "BTREE",
        fields: [
          { name: "ucreatedate" },
        ]
      },
      {
        name: "userid",
        using: "BTREE",
        fields: [
          { name: "userid" },
        ]
      },
    ]
  });
};
