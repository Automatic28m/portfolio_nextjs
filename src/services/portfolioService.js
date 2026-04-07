import { db } from '@/lib/db';

const formatDate = (date, options = { year: 'numeric', month: 'short' }) => {
    if (!date) return "";
    const d = new Date(date);
    return isNaN(d.getTime()) ? "" : d.toLocaleDateString('en-GB', options);
};

export async function getPortfolio() {
    const [rows] = await db.query(`
        SELECT p.*, pt.title AS type_title 
        FROM portfolio p 
        LEFT JOIN portfolio_type pt ON p.portfolio_type_id = pt.id
    `);
    return rows.map(item => ({ 
        ...item, 
        event_date: formatDate(item.event_date),
        created: formatDate(item.created)
    }));
}

export async function getPortfolioById(id) {
    const [rows] = await db.query("SELECT * FROM portfolio WHERE id = ?", [id]);
    return rows.length ? { ...rows[0], event_date: formatDate(rows[0].event_date) } : null;
}

export async function getPortfolioByIdForEdit(id) {
    const [rows] = await db.query("SELECT * FROM portfolio WHERE id = ?", [id]);
    if (!rows.length) return null;

    const portfolio = rows[0];
    let eventDate = null;
    if (portfolio.event_date) {
        const d = new Date(portfolio.event_date);
        eventDate = Number.isNaN(d.getTime()) ? null : d.toISOString().split('T')[0];
    }

    return {
        ...portfolio,
        event_date: eventDate,
    };
}

export async function getPortfolioByTypeId(typeId) {
    const [rows] = await db.query("SELECT * FROM portfolio WHERE portfolio_type_id = ? ORDER BY event_date DESC", [typeId]);
    return rows.map(item => ({ ...item, event_date: formatDate(item.event_date) }));
}

export const getSkills = () => getPortfolioByTypeId(1);
export const getProjects = () => getPortfolioByTypeId(2);
export const getAchievements = () => getPortfolioByTypeId(3);
export const getInternships = () => getPortfolioByTypeId(4);
export const getActivities = () => getPortfolioByTypeId(5);
export const getEducations = () => getPortfolioByTypeId(6);

export async function getPortfolioType() {
    const [rows] = await db.query("SELECT * FROM portfolio_type ORDER BY id ASC");
    return rows;
}

export async function getDashboardCounts() {
    const [rows] = await db.query("SELECT portfolio_type_id as id, COUNT(*) as total FROM portfolio GROUP BY portfolio_type_id");
    return rows.reduce((acc, curr) => ({ ...acc, [curr.id]: curr.total }), {});
}

export async function getPortfolioWithCounts() {
    const [rows] = await db.query(`
        SELECT p.*, pt.title AS type_title,
        (SELECT COUNT(*) FROM gallery g WHERE g.portfolio_id = p.id) as gallery_count
        FROM portfolio p
        LEFT JOIN portfolio_type pt ON p.portfolio_type_id = pt.id
        ORDER BY p.id DESC
    `);
    return rows.map(item => ({
        ...item,
        event_date: formatDate(item.event_date),
        created: formatDate(item.created)
    }));
}

export async function createFullPortfolio({
    title,
    contents,
    location,
    date,
    thumbnail,
    type_id,
    facebook_url = null,
    website_url = null,
    youtube_url = null,
    instagram_url = null,
    github_url = null,
    galleryUrls = [],
    skillIds = []
}) {
    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();
        const [res] = await conn.query(
            "INSERT INTO portfolio (title, contents, event_location, event_date, thumbnail, portfolio_type_id, facebook_url, website_url, youtube_url, instagram_url, github_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [title, contents, location, date, thumbnail, type_id, facebook_url, website_url, youtube_url, instagram_url, github_url]
        );
        const pId = res.insertId;

        if (galleryUrls.length) {
            await conn.query("INSERT INTO gallery (img, portfolio_id) VALUES ?", [galleryUrls.map(url => [url, pId])]);
        }
        if (skillIds.length) {
            await conn.query("INSERT INTO portfolio_skill_types (portfolio_id, skill_type_id) VALUES ?", [skillIds.map(sId => [pId, sId])]);
        }

        await conn.commit();
        return { success: true, id: pId };
    } catch (e) {
        await conn.rollback();
        throw e;
    } finally {
        conn.release();
    }
}

export async function updatePortfolioFull(id, {
    title,
    contents,
    location,
    date,
    type_id,
    thumbnail,
    facebook_url = null,
    website_url = null,
    youtube_url = null,
    instagram_url = null,
    github_url = null,
    skillIds = []
}) {
    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();
        const sql = thumbnail 
            ? ["UPDATE portfolio SET title=?, contents=?, event_location=?, event_date=?, thumbnail=?, portfolio_type_id=?, facebook_url=?, website_url=?, youtube_url=?, instagram_url=?, github_url=? WHERE id=?", [title, contents, location, date, thumbnail, type_id, facebook_url, website_url, youtube_url, instagram_url, github_url, id]]
            : ["UPDATE portfolio SET title=?, contents=?, event_location=?, event_date=?, portfolio_type_id=?, facebook_url=?, website_url=?, youtube_url=?, instagram_url=?, github_url=? WHERE id=?", [title, contents, location, date, type_id, facebook_url, website_url, youtube_url, instagram_url, github_url, id]];

        await conn.query(...sql);
        await conn.query("DELETE FROM portfolio_skill_types WHERE portfolio_id = ?", [id]);

        if (skillIds.length) {
            await conn.query("INSERT INTO portfolio_skill_types (portfolio_id, skill_type_id) VALUES ?", [skillIds.map(sId => [id, sId])]);
        }

        await conn.commit();
        return { success: true };
    } catch (e) {
        await conn.rollback();
        throw e;
    } finally {
        conn.release();
    }
}

export async function deletePortfolioById(id) {
    return db.query("DELETE FROM portfolio WHERE id = ?", [id]);
}

export async function getGalleryByPortfolioId(id) {
    const [rows] = await db.query("SELECT * FROM gallery WHERE portfolio_id = ?", [id]);
    return rows;
}

export async function getSkillTypes() {
    const [rows] = await db.query("SELECT * FROM skill_type ORDER BY name ASC");
    return rows;
}

export async function getSkillTypeById(id) {
    const [rows] = await db.query("SELECT * FROM skill_type WHERE id = ?", [id]);
    if (!rows.length) throw new Error("Skill type not found");
    return rows[0];
}

export async function addSkillType(name, color) {
    const [res] = await db.query("INSERT INTO skill_type (name, color) VALUES (?, ?)", [name, color]);
    return res.insertId;
}

export async function updateSkillTypeById(id, name, color) {
    const [result] = await db.query(
        "UPDATE skill_type SET name = ?, color = ? WHERE id = ?",
        [name, color, id]
    );

    if (result.affectedRows === 0) {
        throw new Error("Skill type not found");
    }

    return getSkillTypeById(id);
}

export async function deleteSkillTypeById(id) {
    return db.query("DELETE FROM skill_type WHERE id = ?", [id]);
}

export async function getSkillTypesByPortfolioId(id) {
    const [rows] = await db.query(`
        SELECT st.* FROM portfolio_skill_types pst 
        JOIN skill_type st ON pst.skill_type_id = st.id 
        WHERE pst.portfolio_id = ?
    `, [id]);
    return rows;
}