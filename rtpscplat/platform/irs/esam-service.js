function all(db, sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
}

function get(db, sql, params = []) {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) return reject(err);
            resolve(row || null);
        });
    });
}

async function listEsamApplications(db) {
    return all(
        db,
        `SELECT a.id, a.application_type, a.tracking_number, a.application_status,
            a.module_label, a.source_url, a.completed_at,
            p.legal_name, p.dba_name, p.ein
     FROM irs_esam_applications a
     JOIN irs_esam_profiles p ON p.id = a.profile_id
     ORDER BY a.completed_at DESC, a.created_at DESC`
    );
}

async function getEsamApplicationSummary(db, trackingNumber) {
    const application = await get(
        db,
        `SELECT a.*, p.legal_name, p.dba_name, p.ein, p.ssn_masked,
            p.business_structure, p.business_address, p.business_city_state_postal,
            p.mailing_address, p.mailing_city_state_postal, p.phone
     FROM irs_esam_applications a
     JOIN irs_esam_profiles p ON p.id = a.profile_id
     WHERE a.tracking_number = ?`,
        [trackingNumber]
    );

    if (!application) {
        return null;
    }

    const authorizedUsers = await all(
        db,
        `SELECT full_name, role_label, toa_status, phone, email
     FROM irs_esam_authorized_users
     WHERE application_id = ?
     ORDER BY full_name ASC`,
        [application.id]
    );

    const apiClients = await all(
        db,
        `SELECT api_label, client_id, integration_types, redirect_url, status
     FROM irs_esam_api_clients
     WHERE application_id = ?
     ORDER BY api_label ASC`,
        [application.id]
    );

    const efinEtin = await all(
        db,
        `SELECT record_type, record_value, status, effective_date, provider_option, service_type
     FROM irs_esam_efin_etin
     WHERE application_id = ?
     ORDER BY record_type, record_value`,
        [application.id]
    );

    const tccRecords = await all(
        db,
        `SELECT role_label, forms, transmission_method, tcc, tcc_status, effective_date, tp_indicator
     FROM irs_esam_tcc_records
     WHERE application_id = ?
     ORDER BY role_label ASC, tcc ASC`,
        [application.id]
    );

    return {
        application,
        authorizedUsers,
        apiClients,
        efinEtin,
        tccRecords
    };
}

async function getEsamOperationalReadiness(db) {
    const applications = await listEsamApplications(db);
    const completed = applications.filter((item) => item.application_status === 'Completed').length;
    const apiClients = await all(db, 'SELECT * FROM irs_esam_api_clients WHERE status = ?', ['Active']);
    const activeEfinsEtins = await all(db, 'SELECT * FROM irs_esam_efin_etin WHERE status = ?', ['Active']);
    const activeTccs = await all(db, 'SELECT * FROM irs_esam_tcc_records WHERE tcc_status = ?', ['Active']);

    return {
        profile: {
            legalName: applications[0] ? applications[0].legal_name : 'N/A',
            dbaName: applications[0] ? applications[0].dba_name : 'N/A',
            ein: applications[0] ? applications[0].ein : 'N/A'
        },
        readiness: {
            totalApplications: applications.length,
            completedApplications: completed,
            activeApiClients: apiClients.length,
            activeEfinEtin: activeEfinsEtins.length,
            activeTccRecords: activeTccs.length,
            status: completed === applications.length && applications.length > 0 ? 'OPERATIONAL' : 'PENDING_REVIEW'
        }
    };
}

module.exports = {
    listEsamApplications,
    getEsamApplicationSummary,
    getEsamOperationalReadiness
};
