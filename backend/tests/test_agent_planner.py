"""Tests for agent planner."""

from app.agent.planner import AgentPlanner
from app.schemas.agent import ToolType


class TestAgentPlannerHeuristic:
    def setup_method(self):
        self.planner = AgentPlanner()

    def test_heuristic_plan_returns_plan_for_known_keywords(self):
        plan = self.planner._heuristic_plan("find authentication code")
        assert len(plan) > 0
        assert plan[0]["tool"] in {t.value for t in ToolType}

    def test_heuristic_plan_empty_for_irrelevant_query(self):
        plan = self.planner._heuristic_plan("hello how are you")
        assert plan == []

    def test_heuristic_plan_deduplicates_tools(self):
        plan = self.planner._heuristic_plan("repository search for code and documentation search")
        tools = [p["tool"] for p in plan]
        assert len(tools) == len(set(tools))

    def test_heuristic_plan_contains_parameters(self):
        plan = self.planner._heuristic_plan("find database schema")
        if plan:
            assert "parameters" in plan[0]
            assert "query" in plan[0]["parameters"]
            assert "reasoning" in plan[0]


class TestAgentPlannerParsePlan:
    def setup_method(self):
        self.planner = AgentPlanner()

    def test_parse_valid_json_array(self):
        valid_json = '[{"tool": "repository_search", "reasoning": "test", "parameters": {"query": "auth"}}]'
        result = self.planner._parse_plan(valid_json)
        assert len(result) == 1
        assert result[0]["tool"] == "repository_search"

    def test_parse_empty_array(self):
        result = self.planner._parse_plan("[]")
        assert result == []

    def test_parse_json_in_code_fence(self):
        fenced = '```\n[{"tool": "documentation_search", "reasoning": "find docs", "parameters": {"query": "setup"}}]\n```'
        result = self.planner._parse_plan(fenced)
        assert len(result) == 1
        assert result[0]["tool"] == "documentation_search"

    def test_parse_json_with_prefix_text(self):
        text = 'Here is my plan:\n[{"tool": "api_explorer", "reasoning": "check APIs", "parameters": {"query": "endpoints"}}]'
        result = self.planner._parse_plan(text)
        assert len(result) == 1
        assert result[0]["tool"] == "api_explorer"

    def test_parse_filters_unknown_tools(self):
        mixed = '[{"tool": "repository_search", "reasoning": "a", "parameters": {}}, {"tool": "unknown_tool", "reasoning": "b", "parameters": {}}]'
        result = self.planner._parse_plan(mixed)
        assert len(result) == 1
        assert result[0]["tool"] == "repository_search"

    def test_parse_invalid_json_returns_empty(self):
        result = self.planner._parse_plan("not valid json at all")
        assert result == []

    def test_parse_nested_json_handles_escaped_strings(self):
        valid = '[{"tool": "project_explorer", "reasoning": "need to find \\"config\\"", "parameters": {"query": "settings"}}]'
        result = self.planner._parse_plan(valid)
        assert len(result) == 1
        assert result[0]["tool"] == "project_explorer"
